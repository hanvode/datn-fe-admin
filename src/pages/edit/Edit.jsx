import "./edit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import NotFound from "../notFound/NotFound";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { AuthContext } from "../../context/AuthenContext";
import {
  checkLength,
  checkRequired,
} from "../../components/validate/ValidateForm";
import { API_URL } from "../../hooks/config";

// import { FontAwesomeIcon } from "@fontawesome/react-fontawesome";
// import { faUpload } from "@fontawesome/free-solid-svg-icons";

const Edit = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const navigate = useNavigate();
  const { data } = useFetch(`user/${id}`);
  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");
  const { user, dispatch } = useContext(AuthContext);
  const isYou = user?.isAdminPlus || user._id === id;

  useEffect(() => {
    setInfo(data);
  }, [data]);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let newUser = {
        ...info,
      };
      if (file !== "") {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");
        axios.defaults.withCredentials = false;
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dnykvbriw/image/upload",
          data
        );
        const { url } = uploadRes.data;
        newUser = {
          ...info,
          img: url,
        };
      }
      let inputArr = [
        e.target.form[1],
        e.target.form[2],
        e.target.form[4],
        e.target.form[5],
      ];
      let inputClassName = "editFormInput";
      if (!checkRequired(inputArr, inputClassName)) {
        if (!checkLength(e.target.form[4], 4, inputClassName)) {
          const res = await axios.put(`${API_URL}/user/${id}`, newUser);
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });

          navigate(`/user/${id}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(file!=="")
  return (
    <div className="edit">
      <Sidebar />
      <div className="editContainer">
        <Navbar />
        <div className="editTop">
          <h1>YOUR PROFILE</h1>
        </div>
        {isYou ? (
          <div className="editBottom">
            <div className="editLeft">
              <img src={file ? URL.createObjectURL(file) : info?.img} alt="" />
            </div>
            <div className="editRight">
              <form>
                <div className="editFormInput">
                  <label htmlFor="file">
                    Image:{" "}
                    <DriveFolderUploadOutlinedIcon className="editIcon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="editFormInput">
                  <label>UserName</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    value={info.username || ""}
                    id="username"
                  />
                  <span></span>
                  <small></small>
                </div>
                <div className="editFormInput">
                  <label>Email</label>
                  <input
                    onChange={handleChange}
                    type="email"
                    value={info.email || ""}
                    id="email"
                  />
                  <span></span>
                  <small></small>
                </div>
                <div className="editFormInput">
                  <label>Phone</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    value={info.phone || ""}
                    id="phone"
                  />
                  <span></span>
                  <small></small>
                </div>
                <div className="editFormInput">
                  <label>Password</label>
                  <input
                    onChange={handleChange}
                    type="password"
                    id="password"
                  />
                  <span></span>
                  <small></small>
                </div>
                <div className="editFormInput">
                  <label>Age</label>
                  <input
                    onChange={handleChange}
                    type="number"
                    value={info.age || 0}
                    id="age"
                  />
                  <span></span>
                  <small></small>
                </div>
                <div className="editFormInput">
                  <label>Address</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    value={info.address || ""}
                    id="address"
                  />
                  <span></span>
                  <small></small>
                </div>
                <div className="editFormInput noBorder">
                  <label>IsAdmin</label>
                  <select id="isAdmin" onChange={handleChange}>
                    <option value={false}>No</option>
                    <option value={true} selected={info.isAdmin}>
                      Yes
                    </option>
                  </select>
                </div>
                <button onClick={handleClick} className="editButton">
                  Update
                </button>
              </form>
            </div>
          </div>
        ) : (
          <NotFound />
        )}
      </div>
    </div>
  );
};

export default Edit;
