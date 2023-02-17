import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useContext, useState } from "react";
import axios from "axios";
import { hotelInputs } from "../../formSource";
import { AuthContext } from "../../context/AuthenContext";
import { useNavigate } from "react-router-dom";
import {
  checkNumber,
  checkRequired,
} from "../../components/validate/ValidateForm";
import { API_URL } from "../../hooks/config";

const NewHotel = () => {
  const [files, setFiles] = useState("");
  const [infoHotel, setInfoHotel] = useState({});
  const [filterGenre, setFilterGenre] = useState([]);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setInfoHotel((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const handleCheckBox = ({ currentTarget: input }) => {
    if (input.checked) {
      const state = [...filterGenre, input.value];
      setFilterGenre(state);
    } else {
      const state = filterGenre.filter((val) => val !== input.value);
      setFilterGenre(state);
    }
  };
  const genres = ["Vegetarian", "Buffet", "FreeShipping"];
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let newHotel = {
        ...infoHotel,
        genre: filterGenre,
        hotelOwnerId: user._id,
      };
      if (files !== "") {
        const list = await Promise.all(
          //Remember convert object files to array
          Object.values(files).map(async (file) => {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "upload");
            axios.defaults.withCredentials = false;
            const uploadRes = await axios.post(
              "https://api.cloudinary.com/v1_1/dnykvbriw/image/upload",
              data
            );
            const { url } = uploadRes.data;
            return url;
          })
        );
        newHotel = {
          ...infoHotel,
          genre: filterGenre,
          hotelOwnerId: user._id,
          photos: list,
        };
      }
      let inputArr = [
        e.target.form[1],
        e.target.form[2],
        e.target.form[3],
        e.target.form[4],
        e.target.form[5],
        e.target.form[6],
        e.target.form[7],
      ];
      let inputClassName = "formInput";
      try {
        axios.defaults.withCredentials = true;
        if (!checkRequired(inputArr, inputClassName)) {
          if (!checkNumber(e.target.form[7], 5000, inputClassName)) {
            await axios.post(`${API_URL}/hotel`, newHotel);
            navigate(`/hotel`);
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
    <div className="newHotel">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Diner</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files
                  ? URL.createObjectURL(files[0])
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
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  // style={{ display: "none" }}
                />
              </div>

              {hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                  <span></span>
                  <small></small>
                </div>
              ))}
              <div className="formInput noBorder">
                <label>Genre :</label>
                {genres.map((genre) => (
                  <div className="genre" key={genre}>
                    <label className="genreLabel">{genre}</label>
                    <input
                      type="checkbox"
                      value={genre}
                      onChange={handleCheckBox}
                      className="genreInput"
                    />
                  </div>
                ))}
              </div>
              {user?.isAdminPlus && (
                <div className="formInput noBorder">
                  <label>Special</label>
                  <select id="featured" onChange={handleChange}>
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </select>
                </div>
              )}
              <button onClick={handleClick}>Send</button>
            </form>
            {error && <p className="reError">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;
