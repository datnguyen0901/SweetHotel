import "./chart.scss";
import useFetch from "../../hooks/useFetch";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const user = JSON.parse(localStorage.getItem("user"));

const ChartBookingWeek = ({ aspect, title }) => {
  const bookingData = useFetch(
    `/bookings/hotel/income/week/${user._id}`
  ).data;

  // convert object to array
  const data = Object.keys(bookingData).map(
    (key) => bookingData[key]
  );

  return (
    // draw chart by data
    <div className="chart">
      <div className="title">Data of Booking this year</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            padding={{ left: 30, right: 30 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="hour"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="day"
            stroke="#82ca9d"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#DC143C"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartBookingWeek;
