import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthenContext";
import { API_URL } from "../../hooks/config";

const Featured = () => {
  // const startOneDay = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
  const end = new Date();
  const newDay = new Date(new Date().setHours(0, 0, 0, 0));
  const newYesterDay = new Date(
    new Date().setHours(0, 0, 0, 0) - 1 * 24 * 60 * 60 * 1000
  );
  const newLastWeek = new Date(
    new Date().setHours(0, 0, 0, 0) - 7 * 24 * 60 * 60 * 1000
  );
  const newLastTwoWeek = new Date(
    new Date().setHours(0, 0, 0, 0) - 14 * 24 * 60 * 60 * 1000
  );
  const [rToday, setRToday] = useState(0);
  const [rYesday, setRYesday] = useState(0);
  const [rLastWeek, setRLastWeek] = useState(0);
  const [rLast2Week, setRLast2Week] = useState(0);
  const [target, setTarget] = useState(1);
  const { user } = useContext(AuthContext);
  // console.log(newDay);
  const increaseReview =
    target === 0 ? rToday - target : Math.round((rToday / target) * 100);

  const increaseLWeek =
    rLast2Week > 0
      ? `${((rLastWeek - rLast2Week) / rLast2Week) * 100} %)`
      : `${rLastWeek - rLast2Week} )`;

  const increaseYTD =
    rYesday > 0
      ? `${((rToday - rYesday) / rYesday) * 100} %)`
      : `${rToday - rYesday} )`;

  //count review today
  useEffect(() => {
    const countComment = async () => {
      const res = await axios.get(
        `${API_URL}/comment/count-by-time/${user._id}?start=${newDay}&end=${end}`
      );
      setRToday(res.data.total);
    };
    countComment();
  }, [end, newDay, user]);

  //count review yesterday
  useEffect(() => {
    const countComment = async () => {
      const res = await axios.get(
        `${API_URL}/comment/count-by-time/${user._id}?start=${newYesterDay}&end=${newDay}`
      );
      setRYesday(res.data.total);
    };
    countComment();
  }, [newYesterDay, newDay, user]);

  //count review last week
  useEffect(() => {
    const countComment = async () => {
      const res = await axios.get(
        `${API_URL}/comment/count-by-time/${user._id}?start=${newLastWeek}&end=${end}`
      );
      setRLastWeek(res.data.total);
    };
    countComment();
  }, [newLastWeek, end, user]);

  //count review last 2 week
  useEffect(() => {
    const countComment = async () => {
      const res = await axios.get(
        `${API_URL}/comment/count-by-time/${user._id}?start=${newLastTwoWeek}&end=${newLastWeek}`
      );
      setRLast2Week(res.data.total);
    };
    countComment();
  }, [newLastTwoWeek, newLastWeek, user]);

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Reviews On Your Own Hotel</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          {/* {rYesday === 0 && ( */}
          <CircularProgressbar
            value={increaseReview}
            text={`${increaseReview}%`}
            strokeWidth={15}
          />
          {/* )} */}
        </div>
        <p className="title">Total reviews made today</p>
        <p className="amount">{rToday}</p>
        <p className="desc">
          Previous comments processing. Last reviews may not be included.
        </p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Target</div>
            <div className="itemResult positive">
              Review :
              <div className="resultAmount">
                <input
                  type="number"
                  defaultValue={1}
                  min={1}
                  onChange={(e) => setTarget(e.target.value)}
                  style={{ width: "40px", marginLeft: "5px" }}
                />
              </div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Today</div>
            <div
              className={`itemResult ${
                rToday > rYesday ? `positive` : `negative`
              }`}
            >
              <div className="resultAmount">{`${rToday}  (`}</div>
              {rToday > rYesday ? (
                <KeyboardArrowUpOutlinedIcon fontSize="small" />
              ) : (
                <KeyboardArrowDownIcon fontSize="small" />
              )}
              <div className="resultAmount">{increaseYTD}</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Week</div>
            <div
              className={`itemResult ${
                rLastWeek > rLast2Week ? `positive` : `negative`
              }`}
            >
              <div className="resultAmount">{`${rLastWeek}  (`}</div>
              {rLastWeek > rLast2Week ? (
                <KeyboardArrowUpOutlinedIcon fontSize="small" />
              ) : (
                <KeyboardArrowDownIcon fontSize="small" />
              )}
              <div className="resultAmount">{increaseLWeek}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
