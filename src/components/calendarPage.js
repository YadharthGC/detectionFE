import { Avatar, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import "../CSS/calendar.css";
import NavigateNextSharpIcon from "@mui/icons-material/NavigateNextSharp";
import NavigateBeforeSharpIcon from "@mui/icons-material/NavigateBeforeSharp";
import KeyboardDoubleArrowLeftSharpIcon from "@mui/icons-material/KeyboardDoubleArrowLeftSharp";
import KeyboardDoubleArrowRightSharpIcon from "@mui/icons-material/KeyboardDoubleArrowRightSharp";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
// import DoneIcon from "@mui/icons-material/Done";
// import CloseIcon from "@mui/icons-material/Close";
// import { sampCal, sampAtt } from "../calendarSample";
// import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import { renderhost } from "../nodeLink";
import { useDispatch, useSelector } from "react-redux";
import { attendanceSample } from "../calendarSample";
import { handleLocalStorage } from "../commonFunctions";
import { funLoading } from "../reactRedux/action";

export default function CalendarPage() {
  // const [users, setUsers] = useState();
  const [modifyUsers, setModifyUsers] = useState();
  const [displayDays, setDisplayDays] = useState([]);
  const [primaryDate, setPrimaryDate] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [blink, setBlink] = useState("Therapists");
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [status, setStatus] = useState(false);
  const admin = window?.localStorage?.getItem("admin");
  const adminID = window?.localStorage?.getItem("adminID");
  const dispatch = useDispatch();
  // const selector = useSelector((state) => state);
  // const { admin, adminID } = selector.candidateReducer;

  useEffect(() => {
    try {
      handleGetDetails();
      handleSetDays();
    } catch (err) {
      console.log(err);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setStatus(false);
  }, [status]);

  const handleGetDetails = async () => {
    try {
      dispatch(funLoading(true));
      await axios
        .post(`${renderhost}/getData`, { admin, adminID })
        .then((res) => {
          console.log(res.data.message);
          setModifyUsers(res.data.message);
          dispatch(funLoading(false));
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
      dispatch(funLoading(false));
    }
  };

  const handleSetDays = (dateStr) => {
    try {
      let today, yr, mm, dd, todayStr;

      if (!dateStr) {
        today = new Date();
        yr = today.getFullYear();
        mm = today.getMonth() + 1;
        dd = today.getDate();
      }
      todayStr = dateStr
        ? dateStr
        : yr + "-" + ("0" + mm).slice(-2) + "-" + ("0" + dd).slice(-2);
      setPrimaryDate(todayStr);

      const givenDate = new Date(todayStr);
      let daysObj = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(givenDate);
        currentDate.setDate(givenDate.getDate() + i - givenDate.getDay());

        let dayShort = days[currentDate.getDay()].slice(0, 3);
        let dateShort = currentDate.toISOString().split("T")[0].split("-")[2];
        let monthShort = currentDate.toString().split(" ")[1];
        let yearShort = currentDate.toString().split(" ")[3];

        daysObj.push({
          fulldate: currentDate.toISOString().split("T")[0],
          fullday: days[currentDate.getDay()],
          shortDay: dayShort,
          shortDate: dateShort,
          shortMonth: monthShort,
          shortYear: yearShort,
        });
      }

      setDisplayDays(daysObj);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMoveDate = (actions) => {
    try {
      if (actions === "nextt" || actions === "prevv") {
        let presentYear = new Date(primaryDate);
        let currentYear = presentYear.getFullYear();
        let nextYearDate = new Date(presentYear);

        actions === "nextt" && nextYearDate.setFullYear(currentYear + 1); // Set to next year
        actions === "prevv" && nextYearDate.setFullYear(currentYear - 1);

        if (presentYear.getMonth() === 1 && presentYear.getDate() === 29) {
          // Adjust for leap year
          nextYearDate.setMonth(1);
          nextYearDate.setDate(28);
        }

        let nextIso = nextYearDate.toISOString().split("T")[0];

        setPrimaryDate(nextIso);
        handleSetDays(nextIso);
      } else if (actions === "next" || actions === "prev") {
        let theDate =
          actions === "next"
            ? displayDays[displayDays.length - 1].fulldate
            : displayDays[0].fulldate;
        let presentYear = new Date(theDate);
        let nextDay = new Date(presentYear);

        actions === "next" && nextDay.setDate(nextDay.getDate() + 1);
        actions === "prev" && nextDay.setDate(nextDay.getDate() - 1);

        let nextIso = nextDay.toISOString().split("T")[0];

        setPrimaryDate(nextIso);
        handleSetDays(nextIso);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchUser = () => {
    try {
      let changeUsers = [];

      for (let i = 0; i < modifyUsers.length; i++) {
        if (
          modifyUsers[i].name.toLowerCase().includes(searchUser.toLowerCase())
        ) {
          changeUsers.push(modifyUsers[i]);
        }
      }
      setModifyUsers(changeUsers);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeStatus = async (props, actions) => {
    try {
      console.log(props, actions);
      let selectedDate = props.form.fulldate;
      let candidateArr = modifyUsers;
      let attArr;
      if (actions === "present") {
        attArr = props.allObj.attendance;

        for (let i = 0; i < attArr.length; i++) {
          if (attArr[i].date === selectedDate) {
            attArr[i].status = "absent";
            break;
          }
        }
      } else if (actions === "absent") {
        let newAttArr = props.allObj.attendance;

        attArr = newAttArr.filter((data) => {
          return data.date !== selectedDate;
        });
      } else if (actions === "none") {
        attArr = props.allObj.attendance ? props.allObj.attendance : [];

        attArr.push({
          date: selectedDate,
          status: "present",
        });
      }

      for (let i = 0; i < candidateArr.length; i++) {
        if (candidateArr[i].candidateID === props.allObj.candidateID) {
          candidateArr[i].attendance = attArr;
          break;
        }
      }
      setModifyUsers(candidateArr);
      setStatus(true);
      await handleChangeStatusApi(attArr, props.allObj);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeStatusApi = async (attArr, dataObj) => {
    try {
      console.log(attArr, dataObj);
      dataObj.attendance = attArr;
      await axios
        .post(`${renderhost}/attendancechange`, dataObj)
        .then((res) => {
          console.log(res.data.message);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  const HandleSettingSymbols = (props) => {
    try {
      let propsData = props.data;
      let propsForm = props.form;
      let val = propsData
        ? propsData.findIndex((obj) => obj.date === propsForm.fulldate)
        : "";

      if (val !== -1 && propsData?.length) {
        if (propsData[val].status === "present") {
          return (
            <div className="userweekNo">
              <div
                className="tickAttend"
                onClick={() => {
                  handleChangeStatus(props, "present");
                }}
              >
                &#10004;
                {/* <DoneIcon /> */}
              </div>
            </div>
          );
        } else {
          return (
            <div className="userweekNo">
              <div
                className="closeAttend"
                onClick={() => {
                  handleChangeStatus(props, "absent");
                }}
              >
                &#10008;
                {/* <CloseIcon /> */}
              </div>
            </div>
          );
        }
      } else {
        return (
          <div className="userweekNo">
            <div
              className="noneAttend"
              onClick={() => {
                handleChangeStatus(props, "none");
              }}
            >
              -{/* <RemoveIcon /> */}
            </div>
          </div>
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <div className="titleSection">
        <div className="heading">
          <div className="headTitle">Attendance</div>
          <div className="adminSec">
            <span className="adminText">Welcome {admin}</span>
            <span className="AvatarIcon">
              <Avatar alt={admin} src="/static/images/avatar/3.jpg" />
            </span>
          </div>
        </div>
        <div className="calendarSection">
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
          <div className="filterDiv">
            <div className="filterTitle">Weekly Calendar</div>
            <div className="prevNextDiv">
              <KeyboardDoubleArrowLeftSharpIcon
                id="prevprevIcon"
                onClick={() => {
                  handleMoveDate("prevv");
                }}
              />
              <NavigateBeforeSharpIcon
                id="prevIcon"
                onClick={() => {
                  handleMoveDate("prev");
                }}
              />
              <NavigateNextSharpIcon
                id="nextnextIcon"
                onClick={() => {
                  handleMoveDate("next");
                }}
              />
              <KeyboardDoubleArrowRightSharpIcon
                id="nextIcon"
                onClick={() => {
                  handleMoveDate("nextt");
                }}
              />
            </div>
            <div className="calendarDiv">
              <CalendarMonthOutlinedIcon id="calendarOutIcon" />
              &nbsp;
              {displayDays.length && displayDays[0].shortMonth}&nbsp;
              {displayDays.length && displayDays[0].shortDate},
              {displayDays.length && displayDays[0].shortYear} -&nbsp;
              {displayDays.length &&
                displayDays[displayDays.length - 1].shortMonth}
              &nbsp;
              {displayDays.length &&
                displayDays[displayDays.length - 1].shortDate}
              ,
              {displayDays.length &&
                displayDays[displayDays.length - 1].shortYear}
            </div>
            {/* <div className="checkboxesDiv">
              <div className="theDiv">
                <input
                  type="checkbox"
                  id="therapistsCheckBox"
                  onChange={(e) => {
                    setTherapistsUser(e.target.checked);
                  }}
                />
                <label>Therapists</label>
              </div>
              <div className="stuDiv">
                <input
                  type="checkbox"
                  id="studentsCheckBox"
                  onChange={(e) => {
                    setStudentsUser(e.target.checked);
                  }}
                />
                <label>Students</label>
              </div>
            </div> */}
          </div>
          <div className="daysNoDiv">
            <div className="searchDiv">
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
            <div className="daysDiv">
              {displayDays?.length
                ? displayDays.map((data) => {
                    return (
                      <div className="weekNo">
                        <div>{data.shortDay}</div>
                        <div>{data.shortDate}</div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
          <div className="userAttendance">
            {displayDays?.length && modifyUsers?.length
              ? modifyUsers.map((data) => {
                  if (
                    data.role === blink &&
                    (!searchUser ||
                      data.name
                        .toLowerCase()
                        .includes(searchUser.toLowerCase()))
                  ) {
                    return (
                      <div className="userdaysNoDiv">
                        <div className="usersearchDiv">
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
                          <span className="naming">{data.name}</span>
                        </div>

                        <div className="userdaysDiv">
                          {displayDays.map((form, index) => {
                            return (
                              <HandleSettingSymbols
                                data={data.attendance}
                                form={form}
                                index={index}
                                allObj={data}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                })
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
