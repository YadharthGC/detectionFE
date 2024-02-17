import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import "../CSS/dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { sampAll } from "../calendarSample";
import axios from "axios";
import { renderhost } from "../nodeLink";
import { funLoading } from "../reactRedux/action";

export default function DashboardSection() {
  const [users, setUsers] = useState([]);
  const [displayDays, setDisplayDays] = useState([]);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [primaryDate, setPrimaryDate] = useState("");
  const [studentsStrength, setStudentsStrength] = useState("");
  const [therapistsStrength, setTherapistsStrength] = useState("");
  const [studentsPercentage, setStudentsPercentage] = useState("");
  const [therapistsPercentage, setTherapistsPercentage] = useState("");
  const [presentStudents, setPresentStudents] = useState("");
  const [presentTherapists, setPresentTherapists] = useState("");
  const [entries, setEntries] = useState([]);
  const admin = window.localStorage.getItem("admin");
  const adminID = window.localStorage.getItem("adminID");
  const dispatch = useDispatch();

  useEffect(() => {
    handleTotalData();
    handleSetDays();
    handleEntries();
  }, []);

  const handleTotalData = async () => {
    try {
      let dateNow = new Date();
      let today = new Date();
      let yr = today.getFullYear();
      let mm = today.getMonth() + 1;
      let dd = today.getDate();

      let todayStr =
        yr + "-" + ("0" + mm).slice(-2) + "-" + ("0" + dd).slice(-2);

      //apiCall
      let usersArr = [];
      dispatch(funLoading(true));
      await axios
        .post(`${renderhost}/getData`, { admin, adminID })
        .then((res) => {
          console.log(res.data.message, "endayaya");
          usersArr = res.data.message;

          dispatch(funLoading(false));
        })
        .catch((err) => {
          dispatch(funLoading(false));
          console.log(err);
        });

      //

      //percent
      let studentsArr = usersArr.filter((data) => {
        return data.role === "Students";
      });

      let therapistsArr = usersArr.filter((data) => {
        return data.role === "Therapists";
      });

      let presentStudentsSub = studentsArr.filter((data) => {
        let attendance = data?.attendance ? data?.attendance : [];
        for (let i = 0; i < attendance.length; i++) {
          if (attendance[i].date === todayStr) {
            if (attendance[i].status === "present") {
              return data;
            }
            break;
          }
        }
      });

      let presentTherapistsSub = therapistsArr.filter((data) => {
        let attendance = data?.attendance ? data?.attendance : [];
        for (let i = 0; i < attendance.length; i++) {
          if (attendance[i].date === todayStr) {
            if (attendance[i].status === "present") {
              return data;
            }
            break;
          }
        }
      });

      console.log(presentStudentsSub.length, presentTherapistsSub.length);

      let studentsPercent =
        (presentStudentsSub.length / studentsArr.length) * 100;
      let therapistsPercent =
        (presentTherapistsSub.length / therapistsArr.length) * 100;

      console.log(
        studentsArr.length,
        therapistsArr.length,
        presentStudentsSub.length,
        presentTherapistsSub.length,
        studentsPercent,
        therapistsPercent
      );
      setStudentsStrength(studentsArr.length);
      setTherapistsStrength(therapistsArr.length);
      setStudentsPercentage(studentsPercent);
      setTherapistsPercentage(therapistsPercent);
      setPresentStudents(presentStudentsSub);
      setPresentTherapists(presentTherapistsSub);
      //////
    } catch (err) {
      console.log(err);
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

      // let finalToday = splitToday(0, 3);
      // console.log(finalToday);

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

  const handleEntries = async () => {
    try {
      await axios
        .get(`${renderhost}/entries`)
        .then((res) => {
          let dataObj = res?.data?.message;
          setEntries(dataObj.reverse());
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  const selector = useSelector((state) => state);
  return (
    <div>
      <div className="heading">
        <div className="headTitle">DashBoard</div>
        <div className="adminSec">
          <span className="adminText">Welcome {admin}</span>
          <span className="AvatarIcon">
            <Avatar alt={admin} src="/static/images/avatar/3.jpg" />
          </span>
        </div>
      </div>
      <div className="gridA">
        <Grid container columnSpacing={2}>
          <Grid item md={6}>
            <div className="gridItemA">
              <div className="shiftAdmin">Good Morning,{admin}</div>
              <div className="prettyText">
                <span className="prettySpan">
                  Welcome to AbleLyf!Manage attendance with ease
                </span>
              </div>
              <div className="accountDiv">
                {/* <span className="accountSpan">Account</span> */}
              </div>
              <div className="twoBoxes">
                <div className="firstBox">
                  <div className="firstCon">Therapists</div>
                  <div className="secondCon">Under you</div>
                  <div className="thirdCon">{therapistsStrength}</div>
                </div>
                <div className="secondBox">
                  <div className="firstCon">Students</div>
                  <div className="secondCon">Under you</div>
                  <div className="thirdCon">{studentsStrength}</div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item md={6}>
            <div className="gridItemB">
              <div className="showDate">
                <div className="monYr">{primaryDate}</div>
                <div className="dashDays">
                  {displayDays.length
                    ? displayDays.map((data) => {
                        return (
                          <span
                            className={
                              primaryDate.split("-")[2] === data.shortDate
                                ? "weekName setWeekName"
                                : "weekName"
                            }
                          >
                            <div className="deepOne">{data.shortDay}</div>
                            <div className="deepTwo">{data.shortDate}</div>
                          </span>
                        );
                      })
                    : ""}
                  {/* <span className="weekName">
                    <div className="deepOne">SUN</div>
                    <div className="deepTwo">1</div>
                  </span>
                  <span className="weekName">
                    <div className="deepOne">MON</div>
                    <div className="deepTwo">2</div>
                  </span>
                  <span className="weekName">
                    <div className="deepOne">TUE</div>
                    <div className="deepTwo">3</div>
                  </span>
                  <span className="weekName">
                    <div className="deepOne">WED</div>
                    <div className="deepTwo">4</div>
                  </span>
                  <span className="weekName">
                    <div className="deepOne">THU</div>
                    <div className="deepTwo">5</div>
                  </span>
                  <span className="weekName">
                    <div className="deepOne">FRI</div>
                    <div className="deepTwo">6</div>
                  </span>
                  <span className="weekName">
                    <div className="deepOne">SAT</div>
                    <div className="deepTwo">7</div>
                  </span> */}
                </div>
              </div>
              <div className="boxesTwo">
                <div className="boxesTwoA">
                  <div className="pieceA">
                    <div className="showPercent">
                      <div className="percentSpan">{therapistsPercentage}%</div>
                    </div>
                  </div>
                  <div className="pieceB">
                    <div className="whoType">Therapists</div>
                    <div className="blindAttend">Attendance</div>
                    <div className="noof">
                      {presentStudents.length}/{therapistsStrength}
                    </div>
                  </div>
                </div>
                <div className="boxesTwoB">
                  <div className="pieceA">
                    <div className="showPercent">
                      <div className="percentSpan">{studentsPercentage}%</div>
                    </div>
                  </div>
                  <div className="pieceB">
                    <div className="whoType">Students</div>
                    <div className="blindAttend">Attendance</div>
                    <div className="noof">
                      {presentStudents.length}/{studentsStrength}
                    </div>
                  </div>
                </div>
                <div className="boxesTwoC">
                  <div className="helpSupport">
                    <div className="quesA">&#63;</div>
                    <div className="quesB">&#63;</div>
                    <div className="quesC">&#63;</div>
                    <div className="qhpText">Help and Support</div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
      <div className="gridB">
        <Grid container columnSpacing={2}>
          <Grid item md={6}>
            <div className="gridBitemB">
              <div className="eventsTitle">Recent Entry</div>
              <div className="eventsBox">
                {entries?.length
                  ? entries.map((data, index) => {
                      return (
                        <div className="blackBox">
                          <div className="boxA">{index + 1}</div>
                          <div className="boxB">
                            <div className="subA">{data.name}</div>
                            <div className="subB">Therapist</div>
                          </div>
                          <div className="boxC">{data.time}</div>
                        </div>
                      );
                    })
                  : ""}
                {/* <div className="blackBox">
                  <div className="boxA">1</div>
                  <div className="boxB">
                    <div className="subA">John Michael</div>
                    <div className="subB">Therapist</div>
                  </div>
                  <div className="boxC">11.25 - 11.35</div>
                </div>
                <div className="blackBox">
                  <div className="boxA">2</div>
                  <div className="boxB">
                    <div className="subA">John Adams</div>
                    <div className="subB">Student</div>
                  </div>
                  <div className="boxC">11.25 - 11.35</div>
                </div>
                <div className="blackBox">
                  <div className="boxA">3</div>
                  <div className="boxB">
                    <div className="subA">Ken Adams</div>
                    <div className="subB">Therapist</div>
                  </div>
                  <div className="boxC">11.25 - 11.35</div>
                </div> */}
              </div>
            </div>
          </Grid>
          {/* <Grid item md={6}>
            <div className="gridBitemA">
              <div className="eventsTitle">Upcoming Events</div>
              <div className="eventsBox">
                <div className="blackBox">
                  <div className="boxA">1</div>
                  <div className="boxB">
                    <div className="subA">Live Camera Feed</div>
                    <div className="subB">Real Time Moitoring</div>
                  </div>
                  <div className="boxC">11.25 - 11.35</div>
                </div>
                <div className="blackBox">
                  <div className="boxA">2</div>
                  <div className="boxB">
                    <div className="subA">Live Camera Feed</div>
                    <div className="subB">Real Time Moitoring</div>
                  </div>
                  <div className="boxC">11.25 - 11.35</div>
                </div>
                <div className="blackBox">
                  <div className="boxA">3</div>
                  <div className="boxB">
                    <div className="subA">Live Camera Feed</div>
                    <div className="subB">Real Time Moitoring</div>
                  </div>
                  <div className="boxC">11.25 - 11.35</div>
                </div>
              </div>
            </div>
          </Grid> */}
        </Grid>
      </div>
    </div>
  );
}
