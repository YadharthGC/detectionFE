import {
  Avatar,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import none from "../images/blankProfile.jpg";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import "../CSS/crowd.css";
import axios from "axios";
import { renderhost } from "../nodeLink";
import { Player } from "video-react";
import NestCamWiredStandIcon from "@mui/icons-material/NestCamWiredStand";
import { useDispatch } from "react-redux";
import { funLoading } from "../reactRedux/action";

export default function HeatMapPage() {
  const [camName, setCamName] = useState("");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const admin = window.localStorage.getItem("admin");
  const adminID = window.localStorage.getItem("adminID");
  const [camAdd, setCamAdd] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoPlay, setVideoPlay] = useState("");
  const [showData, setShowData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    handleGetHeat();
  }, []);

  const handleGetHeat = async () => {
    try {
      dispatch(funLoading(true));
      await axios
        .get(`${renderhost}/heatentries`)
        .then((res) => {
          console.log(res.data);
          setShowData(res.data.dataArr);
        })
        .catch((err) => {
          dispatch(funLoading(false));
          console.log(err);
        });
      dispatch(funLoading(false));
    } catch (err) {
      dispatch(funLoading(false));
      console.log(err);
    }
  };

  const handleAddCam = async () => {
    try {
      dispatch(funLoading(true));
      console.log(camName, ip, port, userName, password);
      //cam name : "rtsp://ipadresss:username@password:port/live"
      let rtspLink = `rtsp://${ip}:${userName}@${password}:${port}/liv`;
      let rtspObj = {
        camName: camName,
        rtspLink: rtspLink,
      };
      await axios
        .post(`${renderhost}/addCam`, rtspObj)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          dispatch(funLoading(false));
          console.log(err);
        });
      dispatch(funLoading(false));
      console.log(rtspLink);

      setCamAdd(false);
    } catch (err) {
      dispatch(funLoading(false));
      console.log(err);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
    border: "solid 1px gray",
    borderRadius: "30px",
  };

  const videoStyle = {
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

  return (
    <>
      <div className="heading">
        <div className="headTitle">Heat Map Analysis</div>
        <div className="adminSec">
          <span className="adminText">Welcome {admin}</span>
          <span className="AvatarIcon">
            <Avatar alt={admin} src="/static/images/avatar/3.jpg" />
          </span>
        </div>
      </div>
      <div className="crowdDetectionSection">
        <div className="allTextDiv videoDiv">
          <div className="userTextField videoSpace">
            <span className="addCamText">Add Camera</span>&nbsp;&nbsp;
            <VideoCallIcon
              id="videoCallIcon"
              onClick={() => {
                setCamAdd(true);
              }}
            />
          </div>
        </div>
        <div className="allTableDiv">
          <div className="allTableHead">
            <div className="headA entry">Image</div>
            <div className="headB entry">CamID</div>
            <div className="headD entry">Persons</div>
            <div className="headC entry">Timing</div>
            {/* <div className="headE entry">Actions</div> */}
          </div>
          <div className="allTableBody crowd">
            {showData?.length
              ? showData.map((data) => {
                  return (
                    <div className="bodyPart">
                      <div className="conA entry">
                        <img
                          alt={"none"}
                          src={data.image}
                          className="entryUserImg crowd"
                          onClick={() => {
                            setVideoPlay(data.detetctedvideo);
                            setShowVideo(true);
                          }}
                        />
                      </div>
                      <div className="conB entry">{data.camName}</div>
                      <div className="conC entry">{data.noOfPersons}</div>
                      <div className="conD entry">
                        <div>{data.time}</div>
                        <div>{data.date}</div>
                      </div>

                      <div className="conE entry">
                        <NestCamWiredStandIcon id="ipIcon" />
                      </div>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
      </div>

      <Modal
        open={camAdd}
        onClose={() => {
          setCamAdd(false);
        }}
      >
        <Box sx={style}>
          <div className="camAddDiv">
            <div className="addCameraTitle">Add Camera</div>
            <div className="detailsName">
              <div className="naming">
                <div className="namingText">UserName</div>
                <div className="namingB">
                  <TextField
                    id="outlined-basic"
                    label="UserName"
                    variant="outlined"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="naming">
                <div className="namingText">Password</div>
                <div className="namingB">
                  <TextField
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="naming">
                <div className="namingText">CAM name</div>
                <div className="namingB">
                  <TextField
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    value={camName}
                    onChange={(e) => {
                      setCamName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="naming">
                <div className="namingText">IP Address</div>
                <div className="namingB">
                  <TextField
                    id="outlined-basic"
                    label="IP"
                    variant="outlined"
                    value={ip}
                    onChange={(e) => {
                      setIp(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="naming">
                <div className="namingText">Port</div>
                <div className="namingB">
                  <TextField
                    id="outlined-basic"
                    label="Port"
                    variant="outlined"
                    value={port}
                    onChange={(e) => {
                      setPort(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="camAddSubmit">
              <Button
                variant="contained"
                onClick={() => {
                  handleAddCam();
                }}
              >
                submit
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
      <Modal
        open={showVideo}
        onClose={() => {
          setShowVideo(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ marginTop: "5%", marginBottom: "5%" }}
      >
        <Box sx={videoStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {/* <ReactPlayer src="https://firebasestorage.googleapis.com/v0/b/ablelyfvideo.appspot.com/o/videos%2FFacebook%20242169015424324(720p).mp4?alt=media&token=a8570090-8ed5-421f-9c3b-05fd55f507d1" /> */}
            <Player
              autoPlay={true}
              onEnded={() => {
                setShowVideo(false);
              }}
            >
              {/* <source src="https://firebasestorage.googleapis.com/v0/b/ablelyfvideo.appspot.com/o/videos%2FFacebook%20242169015424324(720p).mp4?alt=media&token=a8570090-8ed5-421f-9c3b-05fd55f507d1" /> */}
              <source src={videoPlay} />
            </Player>
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
