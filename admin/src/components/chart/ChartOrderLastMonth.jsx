import "./chart.scss";
import useFetch from "../../hooks/useFetch";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";

const user = JSON.parse(localStorage.getItem("user"));

const ChartOrderLastMonth = ({ aspect, title }) => {
  const orderData = useFetch(
    `/orders/hotel/income/service/lastmonth/${user._id}`
  ).data;

  const [t] = useTranslation("common");

  // convert object to array
  const data = Object.keys(orderData).map(
    (key) => orderData[key]
  );

  return (
    // draw chart by data
    <div className="chart">
      <div className="title">
        {t("dataOf")} {t("orderChart")} {t("lastMonth")}
      </div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <ComposedChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis
            dataKey="name"
            scale="middle"
            padding={{ left: 30, right: 30 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="quantity"
            fill="#8884d8"
            stroke="#8884d8"
          />
          <Bar
            dataKey="total"
            barSize={20}
            fill="#413ea0"
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#ff7300"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartOrderLastMonth;
