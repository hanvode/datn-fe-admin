import "./newFood.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { foodInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import { AuthContext } from "../../context/AuthenContext";
import {
  checkNumber,
  checkRequired,
} from "../../components/validate/ValidateForm";

const NewFood = () => {
  const [file, setFile] = useState("");
  const [infoFood, setInfoFood] = useState({});
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { data, loading } = useFetch(`/user/hotel-own/${user._id}`);
  const [error, setError] = useState("");
  const [hotelId, setHotelId] = useState([]);
  const handleChange = (e) => {
    setInfoFood((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  // console.log(infoFood);
  const handleSelectHotel = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setHotelId(value);
  };
  const handleClick = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "upload");
    try {
      let newFood = {
        ...infoFood,
        hotelId,
      };
      if (file !== "") {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dnykvbriw/image/upload",
          data
        );
        const { url } = uploadRes.data;
        newFood = {
          ...infoFood,
          hotelId,
          img: url,
        };
      }
      let inputArr = [e.target.form[1], e.target.form[2], e.target.form[3]];
      let inputClassName = "formInput";
      if (!checkRequired(inputArr, inputClassName)) {
        if (!checkNumber(e.target.form[3], 1000, inputClassName)) {
          await axios.post("/food", newFood);
          navigate(`/food`);
        }
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <div className="newFood">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Food</h1>
        </div>
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
                />
              </div>

              {foodInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    required
                  />
                  <span></span>
                  <small></small>
                </div>
              ))}
              <div className="formInput noBorder">
                <label>Choose hotel</label>
                <select
                  id="hotelId"
                  multiple
                  onChange={(e) => handleSelectHotel(e)}
                  className="hotelId"
                >
                  {loading
                    ? "Loading"
                    : data &&
                      data.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name}
                        </option>
                      ))}
                </select>
              </div>
              <button onClick={handleClick} style={{ height: "40px" }}>
                Send
              </button>
            </form>
            {error && <p className="reError">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFood;
