import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import NotFound from "../notFound/NotFound";
import Navbar from "../../components/navbar/Navbar";
import Datatable from "../../components/datatable/Datatable";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthenContext";
import { hotelColumns, foodColumns } from "../../datatablesource";

const List = ({ columns }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        {user.isAdminPlus ? (
          <Datatable columns={columns} />
        ) : columns === hotelColumns ? (
          <Datatable columns={columns} isNotAdminPlus={!user.isAdminPlus}/>
        ) : columns === foodColumns ? (<Datatable columns={columns} />) : (
          <NotFound />
        )}
      </div>
    </div>
  );
};

export default List;
