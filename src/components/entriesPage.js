import { Avatar, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import ronaldo from "../images/blankProfile.jpg";
import "../CSS/entries.css";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import NestCamWiredStandIcon from "@mui/icons-material/NestCamWiredStand";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import { funEdit, funLoading } from "../reactRedux/action";
import { useDispatch, useSelector } from "react-redux";
import { entrySample } from "../calendarSample";
import axios from "axios";
import { renderhost } from "../nodeLink";

export default function EntriesPage() {
  const selector = useSelector((state) => state);
  const dispatch = useDispatch();
  const [blink, setBlink] = useState("Therapists");
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const admin = window.localStorage.getItem("admin");
  const adminID = window.localStorage.getItem("adminID");
  const [candidatesIDArr, setCandidatesIDarr] = useState([]);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    // console.log(entrySample);
    // setUsers(entrySample);
    handleGetData();
    handleEntryData();
  }, []);

  useEffect(() => {
    setStatus(false);
  }, [status]);

  const handleGetData = async () => {
    try {
      !candidatesIDArr.length && dispatch(funLoading(true));
      await axios
        .post(`${renderhost}/getData`, { admin, adminID })
        .then((res) => {
          console.log(res);
          let arrCandidateId = res.data.message.map((data) => {
            return data.candidateID;
          });
          console.log(arrCandidateId);
          setCandidatesIDarr(arrCandidateId);
          // setShowUsers(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          dispatch(funLoading(false));
        });
      dispatch(funLoading(false));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEntryData = async () => {
    try {
      dispatch(funLoading(true));
      await axios
        .get(`${renderhost}/entries`)
        .then((res) => {
          let dataObj = res?.data?.message;
          console.log(dataObj);

          setUsers(dataObj.reverse());
        })
        .catch((err) => {
          console.log(err);

          dispatch(funLoading(false));
        });

      dispatch(funLoading(false));
    } catch (err) {
      console.log(err);
      dispatch(funLoading(false));
    }
  };

  const handleDeleteData = async (data) => {
    try {
      await axios.post(`${renderhost}/deleteentries`, data).then((res) => {
        let newUsersArr = users.filter((datae) => {
          return datae["_id"] !== data["_id"];
        });
        setUsers(newUsersArr);
        setStatus(true);
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="heading">
        <div className="headTitle">Entries</div>
        <div className="adminSec">
          <span className="adminText">Welcome {admin}</span>
          <span className="AvatarIcon">
            <Avatar alt={admin} src="/static/images/avatar/3.jpg" />
          </span>
        </div>
      </div>
      <div className="entriesSection">
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
        </div>
        <div className="allTableDiv">
          <div className="allTableHead">
            <div className="headA entry">{blink}</div>
            <div className="headB entry">Name</div>
            <div className="headD entry">
              {/* {blink === "Students" ? "Shift" : "EmployeeID"} */}
              Role
            </div>
            <div className="headC entry">Timing</div>
            <div className="headE entry">Actions</div>
          </div>
          <div className="allTableBody">
            {users?.length
              ? users.map((data) => {
                  if (
                    data.role === blink &&
                    (!searchUser ||
                      data.name
                        .toLowerCase()
                        .includes(searchUser.toLowerCase())) &&
                    candidatesIDArr.includes(data.candidateID)
                  ) {
                    return (
                      <div className="bodyPart">
                        <div className="conA entry">
                          <img
                            alt={data.name}
                            src={data.image}
                            className="entryUserImg"
                          />
                        </div>
                        <div className="conB entry">{data.name}</div>
                        <div className="conC entry">{blink}</div>
                        <div className="conD entry">
                          <div>{data.time}</div>
                          <div>{data.date}</div>
                        </div>

                        <div className="conE entry">
                          {/* <NestCamWiredStandIcon id="ipIcon" />
                        <VideocamIcon id="webIcon" /> */}
                          {/* <ModeEditIcon
                            id="editIcon"
                            onClick={() => {
                              dispatch(funEdit(true));
                              // dispatch(funSelectCandidate(data));
                              // navigate("/register");
                            }}
                          /> */}
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
    </>
  );
}
