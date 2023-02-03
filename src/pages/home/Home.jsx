import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthenContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          {user.isAdminPlus && <Widget type="user" />}
          <Widget type="hotel" />
          <Widget type="food" />
          {user.isAdminPlus && <Widget type="comment" />}
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 12 Months (Reviews)" aspect={3 / 1} type="home" />
        </div>
        <div className="listContainer">
          <div className="listTitle">Newest Comment</div>
          <Table type="home" id={user?._id} />
        </div>
      </div>
    </div>
  );
};

export default Home;
