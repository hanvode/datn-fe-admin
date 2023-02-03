import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import List from "../../components/table/Table";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthenContext";

const Single = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const infoUser = useFetch(`/user/${id}`);
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  // console.log(infoUser);
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            { user.isAdminPlus || user._id === infoUser.data?._id ?
              <div
              className="editButton"
              onClick={() => navigate(`/user/edit/${id}`)}
            >
              Edit
            </div> : <></>
            
            }
            <h1 className="title">Information</h1>
            <div className="item">
              <img src={infoUser.data?.img} alt="avatar" className="itemImg" />
              <div className="details">
                <h1 className="itemTitle">{infoUser.data?.username}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{infoUser.data?.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{infoUser.data?.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Age:</span>
                  <span className="itemValue">{infoUser.data?.age}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">{infoUser.data?.address}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
          <h1 className="title">My comment</h1>
          <List type="myComment" id={id}/>
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">My favorite hotels</h1>
          <List type="user" id={id}/>
        </div>
      </div>
    </div>
  );
};

export default Single;
