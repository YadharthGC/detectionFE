import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import "../CSS/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { renderhost } from "../nodeLink";
import { useDispatch } from "react-redux";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      let dataObj = {
        mail: mail,
        password: password,
      };
      await axios
        .post(`${renderhost}/login`, dataObj)
        .then((res) => {
          console.log(res.data);
          if (res.data.message !== "No login") {
            window.localStorage.setItem("admin", res.data.name);
            window.localStorage.setItem("adminID", res.data.adminID);
            navigate("/filearea/dashboard");
          } else {
            alert("no login found");
          }
        })
        .catch((err) => console.log(err));
      // navigate("/fileArea/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="loginSection">
      <Box id="loginBox">
        <div className="heading loginHeading">Login</div>
        <div className="mailSection">
          <input
            type="text"
            id="mailText"
            placeholder="Email"
            value={mail}
            onChange={(e) => {
              setMail(e.target.value);
            }}
          />
        </div>
        <div className="passwordSection">
          <input
            type="password"
            id="passwordText"
            placeholder="Password"
            val={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="submitSection">
          <Button
            variant="contained"
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </Button>
        </div>
        <div className="registersSection">
          <span
            className="accText"
            onClick={() => {
              navigate("/register");
            }}
          >
            Don't have an account?Create a new One
          </span>
        </div>
      </Box>
    </div>
  );
}
