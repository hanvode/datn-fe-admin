import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../hooks/config";

const List = ({ type, id }) => {
  const [list, setList] = useState([]);
  

  const tableCell = [
    "ID",
    "Name",
    "Genre",
    "Title",
    "Address",
    "District",
    "Rating",
  ];
  const commentCell = [
    "DinerID",
    "Name",
    "Content",
    "Rating",
    "ReplyNum",
    "UpdatedAt",
    "CreatedAt",
  ];
  useEffect(() => {
    const getDataFood = async () => {
      const res = await axios.get(`${API_URL}/food/own-hotel/${id}`);
      setList(res.data);
    };
    const getListFollowed = async () => {
      const res = await axios.get(`${API_URL}/user/all-followed/${id}`);
      setList(res.data);
    };
    const getAllCommentNewest = async () => {
      const res = await axios.get(`${API_URL}/comment/own-hotel/${id}`);
      setList(res.data.comments.flat(Infinity));
    };
    const getAllMyComment = async () => {
      const res = await axios.get(`${API_URL}/comment/own-comment/${id}`);
      setList(res.data.comments);
    };
    if (type === "food") {
      getDataFood();
    } else if (type === "user") {
      getListFollowed();
    } else if (type === "home") {
      getAllCommentNewest();
    } else if (type === "myComment") {
      getAllMyComment();
    }
  }, [id, type]);
  return (
    <TableContainer component={Paper} className="table" sx={type !== "food" && { height: 400 }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {type === "food" &&
              tableCell.map((item) => (
                <TableCell className="tableCell" key={item}>
                  {item}
                </TableCell>
              ))}
            {type === "user" &&
              tableCell.map((item) => (
                <TableCell className="tableCell" key={item}>
                  {item}
                </TableCell>
              ))}
            {type === "home" &&
              commentCell.map((item) => (
                <TableCell className="tableCell" key={item}>
                  {item}
                </TableCell>
              ))}
            {type === "myComment" &&
              commentCell.map((item) => (
                <TableCell className="tableCell" key={item}>
                  {item}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {type === "food" &&
            list.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="tableCell">{item._id}</TableCell>
                <TableCell className="tableCell">
                  <div className="cellWrapper">
                    <img src={item.photos[0]} alt="" className="image" />
                    {item.name}
                  </div>
                </TableCell>
                <TableCell className="tableCell">{item.genre}</TableCell>
                <TableCell className="tableCell">{item.title}</TableCell>
                <TableCell className="tableCell">{item.address}</TableCell>
                <TableCell className="tableCell">{item.city}</TableCell>
                <TableCell className="tableCell">
                  <span className={`status Approved`}>
                    {item.numReviews === 0
                      ? 0
                      : (item?.rating / item?.numReviews).toFixed(2)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          {type === "user" &&
            list.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="tableCell">{item._id}</TableCell>
                <TableCell className="tableCell">
                  <div className="cellWrapper">
                    <img src={item.photos[0]} alt="" className="image" />
                    {item.name}
                  </div>
                </TableCell>
                <TableCell className="tableCell">{item.genre}</TableCell>
                <TableCell className="tableCell">{item.title}</TableCell>
                <TableCell className="tableCell">{item.address}</TableCell>
                <TableCell className="tableCell">{item.city}</TableCell>
                <TableCell className="tableCell">
                  <span className={`status Approved`}>
                    {item.numReviews === 0
                      ? 0
                      : item?.rating / item?.numReviews}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          {type === "home" &&
            list.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="tableCell">{item.hotelId}</TableCell>
                <TableCell className="tableCell">{item.username}</TableCell>
                <TableCell className="tableCell">{item.content}</TableCell>
                <TableCell className="tableCell">{item.rating}</TableCell>
                <TableCell className="tableCell">{item.reply.length}</TableCell>
                <TableCell className="tableCell">{item.updatedAt}</TableCell>
                <TableCell className="tableCell">{item.createdAt}</TableCell>
              </TableRow>
            ))}
          {type === "myComment" &&
            list.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="tableCell">{item.hotelId}</TableCell>
                <TableCell className="tableCell">{item.username}</TableCell>
                <TableCell className="tableCell">{item.content}</TableCell>
                <TableCell className="tableCell">{item.rating}</TableCell>
                <TableCell className="tableCell">{item.reply.length}</TableCell>
                <TableCell className="tableCell">{item.updatedAt}</TableCell>
                <TableCell className="tableCell">{item.createdAt}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
