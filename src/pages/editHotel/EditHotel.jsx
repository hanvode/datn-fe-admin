import "./editHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthenContext";
import {
  checkNumber,
  checkRequired,
} from "../../components/validate/ValidateForm";
import NotFound from "../notFound/NotFound";
import { API_URL } from "../../hooks/config";

const EditHotel = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const navigate = useNavigate();
  const { data } = useFetch(`hotel/find/${id}`);
  const [files, setFiles] = useState("");
  const [infoHotel, setInfoHotel] = useState({});
  const [slideNumber, setSlideNumber] = useState(0);
  const [filterGenre, setFilterGenre] = useState([]);
  const { user } = useContext(AuthContext);
  const isHotelOwn = user.hotelOwn.includes(infoHotel._id);

  const genres = ["Vegetarian", "Buffet", "FreeShipping"];

  useEffect(() => {
    setInfoHotel(data);
  }, [data]);
  // console.log(infoHotel);
  const handleMove = (direction) => {
    let newSlideNumber;
    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    }
    setSlideNumber(newSlideNumber);
  };

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
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let newHotel = {
        ...infoHotel,
        genre: filterGenre,
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
      let inputClassName = "editFormInput";
      if (!checkRequired(inputArr, inputClassName)) {
        if (!checkNumber(e.target.form[7], 5000, inputClassName)) {
          await axios.put(`${API_URL}/hotel/${id}`, newHotel);
          navigate(`/hotel/${id}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="editHotel">
      <Sidebar />
      <div className="editHotelContainer">
        <Navbar />
        <div className="top">
          <h1>Update Hotel</h1>
        </div>
        {isHotelOwn || user?.isAdminPlus ? (
          <div className="bottom">
            <div className="left">
              {infoHotel.photos?.map(
                (photo, index) =>
                  index === slideNumber && (
                    <img
                      src={files ? URL.createObjectURL(files[0]) : photo}
                      alt="avatar_hotel"
                      onClick={() => handleMove("l")}
                      key={index}
                    />
                  )
              )}
            </div>
            <div className="right">
              <form>
                <div className="editFormInput">
                  <label htmlFor="file">
                    Image: <DriveFolderUploadOutlinedIcon className="icon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="editFormInput">
                  <label>Name</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    value={infoHotel.name || ""}
                    id="name"
                  />
                  <span></span>
                  <small></small>
                </div>
                <div className="editFormInput">
                  <label>City</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    value={infoHotel.city || ""}
                    id="city"
                  />
                  <span></span>
                  <small></small>
                </div>
                <div className="editFormInput">
                  <label>Address</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    value={infoHotel.address || ""}
                    id="address"
                  />
                  <span></span>
                  <small></small>
                </div>
                <div className="editFormInput">
                  <label>Distance from City Center</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    value={infoHotel.distance || ""}
                    id="distance"
                  />
                  <span></span>
                  <small></small>
                </div>
                <div className="editFormInput">
                  <label>Title</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    value={infoHotel.title || ""}
                    id="title"
                  />
                  <span></span>
                  <small></small>
                </div>
                <div className="editFormInput">
                  <label>Description</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    value={infoHotel.desc || ""}
                    id="desc"
                  />
                  <span></span>
                  <small></small>
                </div>
                <div className="editFormInput">
                  <label>Cheapest Price</label>
                  <input
                    onChange={handleChange}
                    type="number"
                    value={infoHotel.cheapestPrice || ""}
                    id="cheapestPrice"
                  />
                  <span></span>
                  <small></small>
                </div>
                <div className="editFormInput noBorder">
                  <label>Genre :</label>
                  {genres.map((genre) => (
                    <div className="genre" key={genre}>
                      <label className="genreLabel">{genre}</label>
                      <input
                        type="checkbox"
                        value={genre}
                        defaultChecked={infoHotel?.genre?.includes(genre)}
                        onChange={handleCheckBox}
                        className="genreInput"
                      />
                    </div>
                  ))}
                </div>
                {user?.isAdminPlus && (
                  <div className="editFormInput noBorder">
                    <label>Featured</label>
                    <select id="featured" onChange={handleChange}>
                      <option value={false}>No</option>
                      <option value={true} selected={infoHotel?.featured}>
                        Yes
                      </option>
                    </select>
                  </div>
                )}
                <button onClick={handleClick}>Update</button>
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

export default EditHotel;
