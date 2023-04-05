import React, { useContext, useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase-config";
import { AppContext } from "../../helpers/Helpers";
import { useCookies } from "react-cookie";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
const Login = () => {
  const { getCurrentUser } = useContext(AppContext);
  const [cookie, setCookie] = useCookies(["user"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        setCookie("user", res.user.uid, { path: "/" });

        let userInfo = {
          userId: res.user.uid,
          username: res.user.displayName,
          email: res.user.email,
          profilePic: res.user.photoURL,
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
          .post(
            "https://hackerthon-server.vercel.app/api/users/login",
            userInfo
          )
          .catch((err) => {
            console.log(err);
          });
        getCurrentUser(res.user.uid);
      })
      .then(() => navigate("/"))
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        setCookie("user", res.user.uid, { path: "/" });
      })
      .then(() => navigate("/"))
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  };
  return (
    <div style={{ background: "#999999" }}>
      <div className="LoginPageContainer">
        <div className="subLoginPage">
          <IoMdClose className="letterX" />
          {/* <BsTwitter
          className="loginLogo"
          style={{ color: " #1d9aef", fontSize: "40px" }}
        /> */}
          <h1>Sign In to Hospice </h1>
          <button onClick={signInWithGoogle} className="googleBtn">
            {" "}
            <FcGoogle size={30} /> Sign In With Google{" "}
          </button>
          <div className="orBars">
            <div className="leftBar"></div>
            <div>
              <h1>or</h1>
            </div>
            <div className="rightBar"></div>
          </div>
          <form onSubmit={handleLogin}>
            <input
              className="Input"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
            />
            <input
              className="Input"
              type="text"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
            <div className="loginFlexBtn">
              <button
                className="LoginSignInBtn"
                style={{ backgroundColor: "black", color: "white" }}
                id="nextBtn"
              >
                Sign In{" "}
              </button>
              {/* <button className='LoginSignInBtn' id='backgroundHover' >  Forgot Password? </button> */}
            </div>
            <p>
              Don't have an account?{" "}
              <Link to="/register">
                <span style={{ color: "#1d9aef", cursor: "pointer" }}>
                  Sign up
                </span>
              </Link>{" "}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
