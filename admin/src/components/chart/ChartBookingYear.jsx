import "./chart.scss";
import useFetch from "../../hooks/useFetch";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const user = JSON.parse(localStorage.getItem("user"));

const ChartBookingYear = ({ aspect, title }) => {
  const bookingData = useFetch(
    `/bookings/hotel/income/year/${user._id}`
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
        <BarChart width={1500} height={600} data={data}>
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis />
          <Legend
            width={300}
            wrapperStyle={{
              top: 40,
              right: 20,
              backgroundColor: "#f5f5f5",
              border: "1px solid #d5d5d5",
              borderRadius: 3,
              lineHeight: "40px",
            }}
          />
          <CartesianGrid
            stroke="#ccc"
            strokeDasharray="5 5"
          />
          <Tooltip />
          <Bar dataKey="hour" fill="#00FF00" barSize={20} />
          <Bar dataKey="day" fill="#0000FF" barSize={20} />
          <Bar
            dataKey="total"
            fill="#8884d8"
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartBookingYear;
