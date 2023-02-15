import "./widget.scss";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import StoreIcon from "@mui/icons-material/Store";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import CommentIcon from "@mui/icons-material/Comment";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthenContext";

const Widget = ({ type }) => {
  const { user } = useContext(AuthContext);
  let source;
  const { data } = useFetch(`${type}`);
  //temporary
  // const diff = 20;

  switch (type) {
    case "user":
      source = {
        title: "USERS",
        link: "See all users",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "hotel":
      source = {
        title: "DINERS",
        link: "View all diners",
        icon: (
          <StoreIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "food":
      source = {
        title: "FOODS",
        link: "View all foods",
        icon: (
          <FastfoodIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "comment":
      source = {
        title: "REVIEWS",
        link: "See details",
        icon: (
          <CommentIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{source.title}</span>
        <span className="counter">
          {type === "hotel"
            ? !user.isAdminPlus
              ? user.hotelOwn.length
              : data.length
            : data.length}
        </span>
        <Link to={`/${type}`} className="link">
          {source.link}
        </Link>
      </div>
      <div className="right">
        {/* <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div> */}
        {source.icon}
      </div>
    </div>
  );
};

export default Widget;
