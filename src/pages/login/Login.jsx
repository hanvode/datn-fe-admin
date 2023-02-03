import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthenContext.js";
import "./login.scss";
import {ToastContainer , toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });
  const navigate = useNavigate();
  const { loading, error, dispatch } = useContext(AuthContext);
  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      if (res.data.details.isAdmin) {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        navigate("/");
        notify()
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: { message: "You are not allowed!" },
        });
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: { message: error.response.statusText },
      });
    }
  };
  const notify = () => {
    toast("LOGIN SUCCESSFULLY!!!")
  }
  return (
    <div className="login">
      <ToastContainer/>
      <div className="lContainer">
        <input
          type="text"
          id="username"
          className="lInput"
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="password"
          id="password"
          className="lInput"
          onChange={handleChange}
          placeholder="Password"
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Login;
