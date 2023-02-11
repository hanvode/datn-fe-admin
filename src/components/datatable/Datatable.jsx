import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useEffect } from "react";
import axios from "axios";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthenContext";
import { API_URL } from "../../hooks/config";

const Datatable = ({ columns, isNotAdminPlus }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState([]);
  const { user } = useContext(AuthContext);
  const { data } = useFetch(`${path}`);
  const listHotelOwn = useFetch(`user/hotel-own/${user._id}`);

  useEffect(() => {
    !isNotAdminPlus ? setList(data) : setList(listHotelOwn.data);
  }, [data, listHotelOwn.data, isNotAdminPlus]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${path}/${id}`);
      setList(list.filter((item) => item._id !== id));
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
            {path !== "comment" && (
              <Link
                to={`/${path}/${params.row._id}`}
                style={{ textDecoration: "none" }}
              >
                <div className="viewButton">View</div>
              </Link>
            )}
            <div className="deleteButton">
              <Popup
                trigger={
                  <button
                    style={{
                      color: "crimson",
                      cursor: "pointer",
                      padding: "2px 5px",
                      border: "none",
                      backgroundColor: "white",
                    }}
                  >
                    {" "}
                    Delete
                    {path === "hotel" && params.row.featured ? ` special` : ""}
                  </button>
                }
                modal
                nested
              >
                {(close) => (
                  <div className="modal" style={{ fontSize: "26px" }}>
                    <button
                      className="close"
                      onClick={close}
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        display: "block",
                        padding: "2px 5px",
                        right: "-10px",
                        top: "-10px",
                        fontSize: "24px",
                        background: "#ffffff",
                        borderRadius: "18px",
                        border: "1px solid #cfcece",
                        lineHeight: "20px",
                      }}
                    >
                      &times;
                    </button>
                    <div
                      className="content"
                      style={{
                        width: "100%",
                        padding: "10px 5px",
                        textAlign: "center",
                      }}
                    >
                      Delete{" "}
                      {path === "user"
                        ? params.row.username
                        : path === "hotel"
                        ? params.row.name
                        : path === "food"
                        ? params.row.title
                        : `${params.row.username} 's comment`}{" "}
                      ?
                    </div>
                    <div
                      className="actions"
                      style={{
                        width: "100%",
                        padding: "10px 5px",
                        margin: "auto",
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <button
                        className="button"
                        style={{
                          padding: "5px 10px",
                          borderRadius: "5px",
                          color: "white",
                          backgroundColor: "darkblue",
                          border: "1px dotted rgba(0, 0, 139, 0.596)",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDelete(params.row._id)}
                      >
                        YES
                      </button>
                      <button
                        className="button"
                        style={{
                          padding: "5px 10px",
                          borderRadius: "5px",
                          color: "white",
                          backgroundColor: "crimson",
                          border: "1px dotted rgba(220, 20, 60, 0.6)",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          // console.log(params.row);
                          close();
                        }}
                      >
                        CLOSE
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        List {path}
        {path !== "comment" && (
          <Link to={`/${path}/new`} className="link">
            Add New
          </Link>
        )}
      </div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;
