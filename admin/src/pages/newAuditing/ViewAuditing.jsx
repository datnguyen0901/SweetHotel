import "../../components/datatable/datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useTranslation } from "react-i18next";
import CircleIcon from "@mui/icons-material/Circle";
import Chart from "../../components/chart/Chart";
import ChartIndividualUser from "../../components/chart/ChartIndividualUser";
import ChartBookingYear from "../../components/chart/ChartBookingYear";
import ChartBookingLastYear from "../../components/chart/ChartBookingLastYear";
import ChartBookingMonth from "../../components/chart/ChartBookingMonth";
import ChartBookingWeek from "../../components/chart/ChartBookingWeek";
import ChartBookingYesterday from "../../components/chart/ChartBookingYesterday";

const ViewAuditing = ({ columns }) => {
  const [list, setList] = useState([]);
  const [t] = useTranslation("common");

  const navigate = useNavigate();
  // get hotelId from login user by roleId
  const user = JSON.parse(localStorage.getItem("user"));
  // get hotelId from role by roleId
  const role = useFetch(`/roles/${user.roleId}`);
  const hotelId = role.data.hotelId;
  const hotelData = useFetch(`/hotels/find/${hotelId}`);
  const { data, loading, error } = useFetch(
    `/rooms/today/availability/${hotelId}`
  );

  const [chart, setChart] = useState("bookings");
  const [timeFrame, setTimeFrame] = useState("today");
  const refreshChart = () => {
    navigate("/auditing");
  };
  const handleChangeChart = (e) => {
    setChart(e.value);
    refreshChart();
  };
  const handleChangeTimeFrame = (e) => {
    setTimeFrame(e.value);
    refreshChart();
  };

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  function displayChart() {
    if (chart === "bookings" && timeFrame === "year") {
      return (
        <ChartBookingYear
          aspect={2 / 1}
          title={t("single.chart")}
        />
      );
    }
    if (chart === "bookings" && timeFrame === "lastYear") {
      return (
        <ChartBookingLastYear
          aspect={2 / 1}
          title={t("single.chart")}
        />
      );
    }
    if (chart === "bookings" && timeFrame === "month") {
      return (
        <ChartBookingMonth
          aspect={2 / 1}
          title={t("single.chart")}
        />
      );
    }
    if (chart === "bookings" && timeFrame === "week") {
      return (
        <ChartBookingWeek
          aspect={2 / 1}
          title={t("single.chart")}
        />
      );
    }
    if (chart === "bookings" && timeFrame === "today") {
      return (
        <ChartBookingYesterday
          aspect={2 / 1}
          title={t("single.chart")}
        />
      );
    }
    if (chart === "orders" && timeFrame === "today") {
      return (
        <Chart title={t("home.title")} aspect={2 / 1} />
      );
    }
  }

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <div>{t("Auditings")}</div>
        <div>
          <button
            value={"bookings"}
            onClick={(e) => handleChangeChart(e.target)}
          >
            Booking
          </button>
          <button
            value={"orders"}
            onClick={(e) => handleChangeChart(e.target)}
          >
            Order
          </button>
        </div>
        <div>
          <button
            value={"today"}
            onClick={(e) => handleChangeTimeFrame(e.target)}
          >
            Yesterday
          </button>
          <button
            value={"week"}
            onClick={(e) => handleChangeTimeFrame(e.target)}
          >
            Last Week
          </button>
          <button
            value={"month"}
            onClick={(e) => handleChangeTimeFrame(e.target)}
          >
            Last Month
          </button>
          <button
            value={"lastYear"}
            onClick={(e) => handleChangeTimeFrame(e.target)}
          >
            Last Year
          </button>
          <button
            value={"year"}
            onClick={(e) => handleChangeTimeFrame(e.target)}
          >
            This Yeah
          </button>
        </div>
      </div>
      {displayChart()}
    </div>
  );
};

export default ViewAuditing;
