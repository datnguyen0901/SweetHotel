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

const ChartBookingMonth = ({ aspect, title }) => {
  const bookingData = useFetch(
    `/bookings/hotel/income/month/${user._id}`
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
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="hour"
            stroke="#DC143C"
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="day"
            stroke="#7FFF00"
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#FFD700"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartBookingMonth;
