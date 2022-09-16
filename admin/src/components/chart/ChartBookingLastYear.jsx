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
import { useTranslation } from "react-i18next";

const user = JSON.parse(localStorage.getItem("user"));

const ChartBookingLastYear = ({ aspect, title }) => {
  const bookingData = useFetch(
    `/bookings/hotel/income/lastyear/${user._id}`
  ).data;

  const [t] = useTranslation("common");

  // convert object to array
  const data = Object.keys(bookingData).map(
    (key) => bookingData[key]
  );

  const monthTickFormatter = (tick) => {
    const date = new Date(tick);

    return date.getMonth() + 1;
  };

  const renderQuarterTick = (tickProps) => {
    const { x, y, payload } = tickProps;
    const { value, offset } = payload;
    const date = new Date(value);
    const month = date.getMonth();
    const quarterNo = Math.floor(month / 3) + 1;

    if (month % 3 === 1) {
      return (
        <text
          x={x + 35}
          y={y - 4}
          textAnchor="middle"
        >{`Q${quarterNo}`}</text>
      );
    }

    const isLast = month === 11;

    if (month % 3 === 0 || isLast) {
      const pathX = Math.floor(
        isLast ? x + 61 * offset : x - offset
      );

      return (
        <path
          d={`M${pathX},${y - 4}v${-35}`}
          stroke="red"
        />
      );
    }
    return null;
  };

  return (
    // draw chart by data
    <div className="chart">
      <div className="title">
        {t("dataOf")} {t("bookingChart")} {t("lastYear")}
      </div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <BarChart
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
          <XAxis
            dataKey="date"
            tickFormatter={monthTickFormatter}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={renderQuarterTick}
            height={1}
            scale="band"
            xAxisId="quarter"
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="hour" fill="#8884d8" />
          <Bar dataKey="day" fill="#82ca9d" />
          <Bar dataKey="total" fill="#DC143C" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartBookingLastYear;
