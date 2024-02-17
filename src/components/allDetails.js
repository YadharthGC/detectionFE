import React, { useEffect, useState } from "react";
import { Avatar, TextField } from "@mui/material";
import "../CSS/allDetails.css";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import NestCamWiredStandIcon from "@mui/icons-material/NestCamWiredStand";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import LightModeIcon from "@mui/icons-material/LightMode";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { useNavigate } from "react-router-dom";
import { funEdit, funLoading, funSelectCandidate } from "../reactRedux/action";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "video.js/dist/video-js.css";
import "video-react/dist/video-react.css";
import { Player } from "video-react";
import { renderhost } from "../nodeLink";
import { sampAll } from "../calendarSample";
import ReactPlayer from "react-player";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");
// const socket = io();

export default function AllDetails() {
  const selector = useSelector((state) => state);
  const dispatch = useDispatch();
  // const [users, setUsers] = useState(sampAll);
  const [showUsers, setShowUsers] = useState([]);
  const [blink, setBlink] = useState("Therapists");
  const [searchUser, setSearchUser] = useState("");
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [showSrc, setShowSrc] = useState("");
  const admin = window.localStorage.getItem("admin");
  const adminID = window.localStorage.getItem("adminID");

  useEffect(() => {
    // if (!searchUser) {
    let getDataCall = async () => {
      await handleGetData();
    };
    getDataCall();
    // }
  }, []);

  useEffect(() => {
    socket.on("receive_msg", (data) => {
      console.log(data);
      alert(data.message);
    });
  }, [socket]);

  useEffect(() => {
    setStatus(false);
  }, [status]);

  useEffect(() => {
    try {
      setSearchUser("");
      // handleSetUser();
    } catch (err) {
      console.log(err);
    }
  }, [blink]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleGetData = () => {
    console.log("calling");
    socket.emit("getMessage");
  };

  // const handleGetData = async () => {
  //   try {
  //     socket.emit();
  //     dispatch(funLoading(true));
  //     await axios
  //       .post(`${renderhost}/getData`, { admin, adminID })
  //       .then((res) => {
  //         console.log(res);
  //         setShowUsers(res.data.message);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         dispatch(funLoading(false));
  //       });
  //     dispatch(funLoading(false));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleDeleteData = async (dataObj) => {
    try {
      dispatch(funLoading(true));
      await axios
        .post(`${renderhost}/deleteId`, dataObj)
        .then((res) => {
          let users = showUsers.filter(
            (data) => data["_id"] !== dataObj["_id"]
          );
          setShowUsers(users);
          setStatus(true);
          dispatch(funLoading(false));
        })
        .catch((err) => {
          console.log(err);
          dispatch(funLoading(false));
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="heading">
        <div className="headTitle">PeopleInfo</div>
        <div className="adminSec">
          <span className="adminText">Welcome {admin}</span>
          <span className="AvatarIcon">
            <Avatar alt={admin} src="/static/images/avatar/3.jpg" />
          </span>
        </div>
      </div>
      <div className="allDetailsSection">
        <div className="attendanceTitle">
          <span
            className="attendanceTherapists"
            blink={blink}
            onClick={() => {
              setBlink("Therapists");
            }}
          >
            Therapists
          </span>
          <span
            className="attendanceStudents"
            blink={blink}
            onClick={() => {
              setBlink("Students");
            }}
          >
            Students
          </span>
        </div>
        <div className="allTextDiv">
          <div className="userTextField">
            <TextField
              id="standard-basic"
              label="Search"
              variant="standard"
              value={searchUser}
              onChange={(e) => {
                setSearchUser(e.target.value);
              }}
            />
          </div>
          <div className="addUserSpan">
            <PersonAddAltOutlinedIcon
              id="addUserIcon"
              onClick={() => {
                dispatch(funSelectCandidate({}));
                navigate("../register");
              }}
            />
          </div>
        </div>
        <div className="allTableDiv">
          <div className="allTableHead">
            <div className="headA">
              {/* <span className="headCheck">
                <input type="checkbox" />
              </span> */}
              {showUsers.length &&
                showUsers.filter((data) => data.role === blink).length}{" "}
              {blink}
            </div>
            <div className="headB">Gender</div>
            <div className="headC">Age</div>
            <div className="headD">
              {blink === "Students" ? "Shift" : "EmployeeID"}
            </div>
            <div className="headE">Actions</div>
          </div>
          <div className="allTableBody">
            {showUsers?.length
              ? showUsers.map((data) => {
                  if (
                    data.role === blink &&
                    (!searchUser ||
                      data.name
                        .toLowerCase()
                        .includes(searchUser.toLowerCase()))
                  ) {
                    return (
                      <div className="bodyPart">
                        <div className="conA">
                          {/* <div className="conAbox">
                          <input type="checkbox" />
                        </div> */}
                          <div className="conAavatar">
                            <Avatar
                              alt={data.name}
                              src={
                                data.photoa
                                  ? data.photoa
                                  : data.photob
                                  ? data.photob
                                  : data.photoc
                                  ? data.photoc
                                  : ""
                              }
                            />
                          </div>
                          <div className="conAtext">{data.name}</div>
                          {blink !== "Therapists" ? (
                            <div className="conAvideocon">
                              <VideoCameraBackIcon
                                id="adIcon"
                                onClick={() => {
                                  handleOpen();
                                  setShowSrc(data.video);
                                }}
                              />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="conB">{data.gender}</div>
                        <div className="conC">
                          <div className="conCno">
                            {parseInt(new Date().toISOString().split("-")[0]) -
                              parseInt(data.dob.toString().split("-")[0])}
                            ,
                          </div>
                          <div className="conCmonth">Born on {data.dob}</div>
                        </div>
                        {blink === "Therapists" ? (
                          <div className="conD">
                            <div className="conDText">{data.employeeID}</div>
                          </div>
                        ) : (
                          <div className="conD">
                            <div className="mrngIcon">
                              {data.shift === "Morning" ? (
                                <LightModeIcon id="mrngIcon" />
                              ) : (
                                <Brightness4Icon />
                              )}
                            </div>
                            <div className="conDText">{data.shift} shift</div>
                          </div>
                        )}

                        <div className="conE">
                          <NestCamWiredStandIcon id="ipIcon" />
                          <VideocamIcon id="webIcon" />
                          <ModeEditIcon
                            id="editIcon"
                            onClick={() => {
                              dispatch(funEdit(true));
                              dispatch(funSelectCandidate(data));
                              navigate("../register");
                            }}
                          />
                          <DeleteIcon
                            id="delIcon"
                            onClick={() => {
                              handleDeleteData(data);
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                })
              : ""}
          </div>
        </div>
      </div>

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ marginTop: "5%", marginBottom: "5%" }}
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {/* <ReactPlayer src="https://firebasestorage.googleapis.com/v0/b/ablelyfvideo.appspot.com/o/videos%2FFacebook%20242169015424324(720p).mp4?alt=media&token=a8570090-8ed5-421f-9c3b-05fd55f507d1" /> */}
              <Player
                autoPlay={true}
                onEnded={() => {
                  handleClose();
                }}
              >
                {/* <source src="https://firebasestorage.googleapis.com/v0/b/ablelyfvideo.appspot.com/o/videos%2FFacebook%20242169015424324(720p).mp4?alt=media&token=a8570090-8ed5-421f-9c3b-05fd55f507d1" /> */}
                <source src={showSrc} />
              </Player>
            </Typography>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
