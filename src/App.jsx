import { useState, useEffect } from "react";
import "./App.css";
import { AppContext } from "./helpers/Helpers";
import { Route, Routes } from "react-router";
import { useCookies } from "react-cookie";
import Register from "./pages/register/Register";
import Homepage from "./pages/homepage/Homepage";
import Login from "./pages/login/Login";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [cookies, setCookie] = useCookies(["user"]);

  const getCurrentUser = (id) => {
    fetch(`http://localhost:5000/api/users/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setUser(res.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCurrentUser(cookies.user);
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, getCurrentUser }}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
