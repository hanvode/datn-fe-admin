import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthenContext";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

// const data = [
//   { month: "January", count: 120 },
//   { month: "February", count: 210 },
//   { month: "March", count: 80 },
//   { month: "April", count: 160 },
//   { month: "May", count: 90 },
//   { month: "June", count: 170 },
//   { month: "July", count: 120 },
//   { month: "August", count: 210 },
//   { month: "September", count: 80 },
//   { month: "October", count: 160 },
//   { month: "November", count: 90 },
//   { month: "December", count: 170 },
// ];
// month : NameHotel, count:
const Chart = ({ aspect, title, type }) => {
  const [dataChart, setDataChart] = useState([]);
  const { user } = useContext(AuthContext);
  const { data } = useFetch(`/user/hotel-own/${user._id}`);

  const [hotelId, setHotelId] = useState(0);

  const handleSelectHotel = (e) => {
    setHotelId(e.target.value);
  };

  useEffect(() => {
    const countCommentByYear = async () => {
      const res = await axios.get(`/comment/count-by-year/${user._id}`);
      setDataChart(res.data.commentCount[hotelId]);
    };
    if (type === "home") {
      countCommentByYear();
    }
  }, [user, hotelId, type]);
  useEffect(() => {
    const countCommentByHotel = async () => {
      if (type !== "home") {
        const res = await axios.get(`/comment/count-by-hotel/${type}`);
        setDataChart(res.data.commentCount);
      }
    };
    countCommentByHotel();
  }, [type]);

  return (
    <div className="chart">
      <div className="title">
        {title}
        {type === "home" && (
          <span>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Hotel</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={hotelId}
                  defaultValue={0}
                  label="Choose Hotel"
                  onChange={handleSelectHotel}
                >
                  {data?.map((item, index) => (
                    <MenuItem value={index} key={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={dataChart}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
