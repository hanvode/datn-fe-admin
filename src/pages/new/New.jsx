import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthenContext";
import NotFound from "../notFound/NotFound";
import {
  checkLength,
  checkRequired,
} from "../../components/validate/ValidateForm";
import { API_URL } from "../../hooks/config";

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const { user } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "upload");
    try {
      let newUser = {
        ...info,
      };
      if (file !== "") {
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
      let inputClassName = "formInput";
      try {
        axios.defaults.withCredentials = true;
        if (!checkRequired(inputArr, inputClassName)) {
          if (!checkLength(e.target.form[4], 4, inputClassName)) {
            await axios.post(`${API_URL}/auth/register`, newUser);
            navigate(`/user`);
          }
        }
      } catch (error) {
        setError(error.response.data.message);
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        {user?.isAdminPlus ? (
          <div className="bottom">
            <div className="left">
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
              />
            </div>
            <div className="right">
              <form>
                <div className="formInput">
                  <label htmlFor="file">
                    Image: <DriveFolderUploadOutlinedIcon className="icon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    // style={{ display: "none" }}
                    required
                  />
                </div>

                {inputs.map((input) => (
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    <input
                      onChange={handleChange}
                      type={input.type}
                      placeholder={input.placeholder}
                      id={input.id}
                      required
                    />
                    <span></span>
                    <small></small>
                  </div>
                ))}
                <div className="formInput noBorder">
                  <label>IsAdmin</label>
                  <select id="isAdmin" onChange={handleChange}>
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </select>
                </div>
                <button onClick={handleClick}>Send</button>
              </form>
              {error && <p className="reError">{error}</p>}
            </div>
          </div>
        ) : (
          <NotFound />
        )}
      </div>
    </div>
  );
};

export default New;
