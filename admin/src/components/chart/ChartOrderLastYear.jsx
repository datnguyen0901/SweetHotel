import "./chart.scss";
import useFetch from "../../hooks/useFetch";
import {
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { useTranslation } from "react-i18next";

const user = JSON.parse(localStorage.getItem("user"));

const ChartOrderLastYear = ({ aspect, title }) => {
  const orderData = useFetch(
    `/orders/hotel/income/service/lastyear/${user._id}`
  ).data;

  const [t] = useTranslation("common");

  // convert object to array
  const data = Object.keys(orderData).map(
    (key) => orderData[key]
  );

  const orderData01 = useFetch(
    `/orders/hotel/income/food/lastyear/${user._id}`
  ).data;

  // convert object to array
  const data01 = Object.keys(orderData01).map(
    (key) => orderData01[key]
  );

  const orderData02 = useFetch(
    `/orders/hotel/income/drink/lastyear/${user._id}`
  ).data;

  // convert object to array
  const data02 = Object.keys(orderData02).map(
    (key) => orderData02[key]
  );

  return (
    // draw chart by data
    <div className="chart">
      <div className="title">
        {t("dataOf")} {t("orderChart")} {t("lastYear")}
      </div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <ScatterChart
          width={730}
          height={250}
          margin={{
            top: 20,
            right: 20,
            bottom: 10,
            left: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            dataKey="name"
          />
          <XAxis
            dataKey="price"
            type="number"
            name="Price"
            ticks={[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
              14, 15,
            ]}
            unit="$"
          />
          <YAxis
            dataKey="quantity"
            name="Quantity"
            domain={[0, 35000]}
            unit=""
          />
          <ZAxis
            dataKey="total"
            range={[100, 100000]}
            name="Total"
            unit="$"
          />
          <Tooltip />
          <Legend />
          <Scatter
            name="Type Drink"
            data={data02}
            fill="#82ca9d"
          >
            <LabelList
              dataKey="name"
              style={{ pointerEvents: "none" }}
            />
          </Scatter>
          <Scatter
            name="Type Food"
            data={data01}
            fill="#DC143C"
          >
            <LabelList
              dataKey="name"
              style={{ pointerEvents: "none" }}
            />
          </Scatter>
          <Scatter
            name="Type Service"
            data={data}
            fill="#8884d8"
          >
            <LabelList
              dataKey="name"
              style={{ pointerEvents: "none" }}
            />
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartOrderLastYear;
