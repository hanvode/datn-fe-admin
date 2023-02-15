import "./singleHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useContext, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { foodColumns } from "../../datatablesource";
import axios from "axios";
import { AuthContext } from "../../context/AuthenContext";
import { API_URL } from "../../hooks/config";

const SingleHotel = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const infoHotel = useFetch(`hotel/find/${id}`);
  const menu = useFetch(`hotel/menu/${id}`);
  const allFood = useFetch(`food`);
  const navigate = useNavigate();
  const [listMenu, setListMenu] = useState([]);
  const [listFood, setListFood] = useState([]);
  const { user } = useContext(AuthContext);
  const isOwnHotel = user.hotelOwn.includes(infoHotel.data._id);
  // console.log(infoHotel.data)
  useEffect(() => {
    setListMenu(menu.data);
  }, [menu.data]);
  useEffect(() => {
    let raw = allFood.data.filter((val) =>
      menu.data.every((food) => food._id !== val._id)
    );
    setListFood(raw);
  }, [allFood.data, menu.data]);

  const handleMove = (direction) => {
    let newSlideNumber;
    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    }
    setSlideNumber(newSlideNumber);
  };
  const handleTouch = (food) => {
    if (listMenu.includes(food)) {
      // axios.put(`/hotel/update-menu/${id}/${food._id}`)
      let val = listMenu.filter((val) => val._id !== food._id);
      setListMenu(val);
      setListFood((prev) => [...prev, food]);
    } else if (listFood.includes(food)) {
      let val = listFood.filter((val) => val._id !== food._id);
      setListFood(val);
      setListMenu((prev) => [...prev, food]);
    }
  };
  const handleClick = async (e) => {
    e.preventDefault();
    let updateMenu = listMenu.map((food) => {
      let obj = {};
      obj.food = food._id;
      obj.isEmpty = false;
      return obj;
    });
    try {
      await axios.put(`${API_URL}/hotel/update-menu/${id}`, updateMenu);
    } catch (error) {
      console.log(error);
    }
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/food/${params.row._id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">View</div>
            </Link>
            <div className="viewButton" onClick={() => handleTouch(params.row)}>
              Touch
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="singleHotel">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        {infoHotel.loading ? (
          "Loading? "
        ) : (
          <div className="top">
            <div className="left">
              {(isOwnHotel || user?.isAdminPlus) && (
                <div
                  className="editButton"
                  onClick={() => navigate(`/hotel/edit/${id}`)}
                >
                  Edit
                </div>
              )}
              <h1 className="title">Diner Information</h1>
              <div className="item" onClick={() => handleMove("l")}>
                {infoHotel.data.photos?.map(
                  (photo, index) =>
                    index === slideNumber && (
                      <img
                        className="itemImg"
                        src={photo}
                        alt="avatar_quan_com"
                        key={index}
                      />
                    )
                )}
                <div className="details">
                  <h1 className="itemTitle">{infoHotel.data?.name}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Title:</span>
                    <span className="itemValue">{infoHotel.data?.title}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Description:</span>
                    <span className="itemValue">{infoHotel.data?.desc}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Genre:</span>
                    <span className="itemValue">
                      {infoHotel.data?.genre?.map((genre) => (
                        <span key={genre}>{genre} </span>
                      ))}
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Distance:</span>
                    <span className="itemValue">
                      {infoHotel.data?.distance} m
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Cheapest Price:</span>
                    <span className="itemValue">
                      {infoHotel.data?.cheapestPrice} VND
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Address:</span>
                    <span className="itemValue">
                      {infoHotel.data?.address} - {infoHotel.data?.city}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="right">
              <Chart
                title="User Spending ( Last 6 Months)"
                aspect={3 / 1}
                type={id}
              />
            </div>
          </div>
        )}
        <div className="bottomMenu">
          <div className="titleMenu">
            <h1 className="title">MENU</h1>
            {isOwnHotel && (
              <button className="saveMenu" onClick={handleClick}>
                SAVE
              </button>
            )}
          </div>
          <DataGrid
            className="datagrid"
            rows={listMenu}
            columns={foodColumns.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={[9]}
            checkboxSelection
            getRowId={(row) => row._id}
          />
        </div>
        <div className="bottom">
          <h1 className="title">ALL FOOD</h1>
          <DataGrid
            className="datagrid"
            rows={listFood}
            columns={foodColumns.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={[9]}
            checkboxSelection
            getRowId={(row) => row._id}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleHotel;
