import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import List from "../../components/table/Table";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const SingleFood = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const infoFood = useFetch(`food/${id}`);
  const navigate = useNavigate();
  // console.log(infoFood);
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left" style={{ height: "200px" }}>
            <div
              className="editButton"
              onClick={() => navigate(`/food/edit/${id}`)}
            >
              Edit
            </div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img src={infoFood.data?.img} alt="avatar" className="itemImg" />
              <div className="details">
                <h1 className="itemTitle">{infoFood.data?.title}</h1>
                <div className="detailItem">
                  <span className="itemKey">Description:</span>
                  <span className="itemValue">{infoFood.data?.desc}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Price:</span>
                  <span className="itemValue">{infoFood.data?.price}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            {/* <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" /> */}
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Hotel own me</h1>
          <List id={infoFood.data?._id} type="food" />
        </div>
      </div>
    </div>
  );
};

export default SingleFood;
