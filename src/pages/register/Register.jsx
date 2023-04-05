import React, { useState, useContext } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../../firebase-config";
import { FcGoogle } from "react-icons/fc";
import { IoMdClose } from "react-icons/io";

import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { AppContext } from "../../helpers/Helpers";

const Register = () => {
  const { getCurrentUser } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [userNames, setUserName] = useState("");
  const [passwords, setPasswords] = useState("");
  const [cookies, setCookie] = useCookies(["user"]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  //Sign In With Google
  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        setCookie("user", res.user.uid, { path: "/" });
        console.log(res.user);

        let userInfo = {
          userId: res.user.uid,
          name: res.user.displayName,
          email: res.user.email,
          profilePic: res.user.photoURL,
          password: "123456",
          address: "",
          gender: "",
          birthday: "",
          nextofkin: "",
          state: "",
          country: "",
          challenge: "",
          appointment: "",
        };
        axios
          .post("http://localhost:5000/api/users/register", userInfo)
          .catch((err) => {
            console.log(err);
          });
        getCurrentUser(res.user.uid);
      })
      .then(() => navigate("/"))
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  };

  //Sign up by creating account
  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, passwords)
      .then((res) => {
        setCookie("user", res.user.uid, { path: "/" });

        const userInfo = {
          userId: res.user.uid,
          username: userNames,
          email: email,
          password: passwords,
          profilePic:
            "https://i.pinimg.com/564x/33/f4/d8/33f4d8c6de4d69b21652512cbc30bb05.jpg",
          address: "",
          gender: "",
          birthday: "",
          nextofkin: "",
          state: "",
          country: "",
          challenge: "",
          appointment: "",
        };
        axios
          .post("http://localhost:5000/api/users/register", userInfo)
          .then(() => navigate("/"))
          .then(() => window.location.reload())
          .catch((err) => {
            console.log(err);
          });
        getCurrentUser(res.user.uid);
        console.log(res.user.uid, "This is submit res");
      })
      .catch((err) => console.log(err));
  };

  const getRandomEmail = () => {
    if (name.length > 0) {
      setEmail(name + "@fake.com");
    } else {
      axios
        .get("https://random-word-api.herokuapp.com/word")
        .then((res) => setEmail(res.data[0] + "@fake.com"))
        .catch((err) => console.log(err));
    }
  };

  const getRandomName = () => {
    if (email.includes("@fake.com")) {
      setUserName(email.split("@")[0]);
    } else {
      axios
        .get("https://random-word-api.herokuapp.com/word")
        .then((res) => setUserName(res.data[0]))
        .catch((err) => console.log(err));
    }
  };

  const getRandomPassword = () => {
    let passNum = "";
    let passChar = "";

    for (let i = 0; i < 10; i++) {
      passNum += Math.floor(Math.random() * 10);
    }
    for (let i = 0; i < 10; i++) {
      passChar += String.fromCharCode(Math.floor(Math.random() * 28) + 98);
    }

    let result = Array.from(
      passNum.length > passChar.length ? passNum : passChar,
      (_, i) => (passNum[i] || "") + (passChar[i] || "")
    ).join("");
    return result;
  };

  return (
    // <div>
    <div className="signUpPageContainer">
      <div className="subLoginPage">
        <IoMdClose className="letterX" />
        <h1>Join Twitter Today</h1>
        <button onClick={signInWithGoogle} className="googleBtn">
          {" "}
          <FcGoogle size={30} /> Sign In With Google{" "}
        </button>
        <div className="orBar">
          <div className="leftBar"></div>
          <h1>or</h1>
          <div className="rightBar"></div>
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="flex-Center">
            <input
              className="Input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
            />
            <div onClick={getRandomEmail} className="generateBtn">
              generate email{" "}
            </div>
          </div>
          <div className="flex-Center">
            <input
              className="Input"
              type="text"
              value={userNames}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter username"
            />
            <div onClick={getRandomName} className="generateBtn">
              generate username{" "}
            </div>
          </div>
          <div className="flex-Center">
            <input
              className="Input"
              type="text"
              value={passwords}
              onChange={(e) => setPasswords(e.target.value)}
              placeholder="Enter Password"
            />
            <div
              className="generateBtn"
              onClick={() => setPasswords(getRandomPassword())}
            >
              generate password{" "}
            </div>
          </div>
          <div className="loginFlexBtn">
            <button
              type="submit"
              className="LoginSignInBtn"
              style={{ backgroundColor: "black", color: "white" }}
              id="nextBtn"
            >
              Create account{" "}
            </button>
            {/* <button className='LoginSignInBtn' id='backgroundHover' >  Forgot Password? </button> */}
          </div>
          <p>
            Have an account already?
            <Link to="/login">
              <span style={{ color: "#1d9aef", cursor: "pointer" }}>
                Log in
              </span>
            </Link>{" "}
          </p>
        </form>
      </div>
    </div>
    // </div>
  );
};

export default Register;
