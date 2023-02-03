import "./editFood.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthenContext";
import {
  checkNumber,
  checkRequired,
} from "../../components/validate/ValidateForm";

const EditFood = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const navigate = useNavigate();
  const { data } = useFetch(`/food/${id}`);
  const [infoFood, setInfoFood] = useState({});
  const [file, setFile] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  useEffect(() => {
    setInfoFood(data);
    // setFile(data.img)
  }, [data]);

  const handleChange = (e) => {
    setInfoFood((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let newFood = {
        ...infoFood,
      };
      if (file !== "") {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dnykvbriw/image/upload",
          data
        );
        const { url } = uploadRes.data;
        newFood = {
          ...infoFood,
          img: url,
        };
      }
      let inputArr = [e.target.form[1], e.target.form[2], e.target.form[3]];
      let inputClassName = "editFoodFormInput";
      if (!checkRequired(inputArr, inputClassName)) {
        if (!checkNumber(e.target.form[3], 1000, inputClassName)) {
          await axios.put(`/food/${id}`, newFood);
          navigate(`/food/${id}`);
        }
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  // console.log(file!=="")
  return (
    <div className="editFood">
      <Sidebar />
      <div className="editFoodContainer">
        <Navbar />
        <div className="editFoodTop">
          <h1>UPDATE FOOD</h1>
        </div>
        {user?.isAdminPlus ? (
          <div className="editFoodBottom">
            <div className="editFoodLeft">
              <img
                src={file ? URL.createObjectURL(file) : infoFood?.img}
                alt=""
              />
            </div>
            <div className="editFoodRight">
              <form>
                <div className="editFoodFormInput">
                  <label htmlFor="file">
                    Image:{" "}
                    <FontAwesomeIcon icon={faUpload} className="editFoodIcon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    // style={{ display: "none" }}
                  />
                </div>
                <div className="editFoodFormInput">
                  <label>Title</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    value={infoFood.title || ""}
                    id="title"
                  />
                  <span></span>
                  <small></small>
                </div>
                <div className="editFoodFormInput">
                  <label>Description</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    value={infoFood.desc || ""}
                    id="desc"
                  />
                  <span></span>
                  <small></small>
                </div>
                <div className="editFoodFormInput">
                  <label>Price</label>
                  <input
                    onChange={handleChange}
                    type="number"
                    value={infoFood.price || 0}
                    id="price"
                  />
                  <span></span>
                  <small></small>
                </div>
                <button onClick={handleClick} className="editFoodButton">
                  Update
                </button>
              </form>
              {error && <p className="reError">{error}</p>}
            </div>
          </div>
        ) : (
          <h1>Only admin can fix food !!!</h1>
        )}
      </div>
    </div>
  );
};

export default EditFood;
