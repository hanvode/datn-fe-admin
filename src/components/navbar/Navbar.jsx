import "./navbar.scss";
// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
// import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
// import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthenContext";
import { API_URL } from "../../hooks/config";
import { io } from "socket.io-client";
import axios from "axios";

const ENDPOINT = "https://datn-comment-realtime.onrender.com/";

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getAllNotifications = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/user/notification/${user._id}`
        );
        setNotifications(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllNotifications();
  }, [user._id]);

  useEffect(() => {
    setSocket(io(ENDPOINT));
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", user._id);
    }
  }, [socket, user._id]);

  useEffect(() => {
    if (socket) {
      socket.on("followNotification", (msg) => {
        setNotifications([msg, ...notifications]);
      });
      return () => socket.off("followNotification");
    }
  }, [socket, notifications]);

  const displayNotification = ({ content, createdAt }) => {
    return (
      <span className="notification">{`${content} vao luc ${createdAt}.`}</span>
    );
  };
  const handleRead = () => {
    setNotifications([]);
    setOpen(false);
  };
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          {/* <input type="text" placeholder="Search..." />
          <SearchOutlinedIcon /> */}
        </div>
        <div className="items">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div className="item">
            <DarkModeOutlinedIcon
              style={{ cursor: "pointer" }}
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>
          <div className="item">
            <NotificationsNoneOutlinedIcon
              style={{ cursor: "pointer" }}
              className="icon"
              onClick={() => setOpen(!open)}
            />
            {notifications.length > 0 && (
              <div className="counter">{notifications.length}</div>
            )}
          </div>
          {open && (
            <div className="notifications">
              {notifications.map((n) => displayNotification(n))}
              {notifications.length > 0 && (
                <button className="nButton" onClick={handleRead}>
                  Mark as read
                </button>
              )}
            </div>
          )}
          {/* <div className="item">
            <FullscreenExitOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <ChatBubbleOutlineOutlinedIcon className="icon" />
            <div className="counter">2</div>
          </div>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div> */}
          <div className="item">Admin {user.username}</div>
          <div className="item">
            <img src={user?.img} alt="" className="avatar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
