import "../../components/datatable/datatable.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ChartBookingYear from "../../components/chart/ChartBookingYear";
import ChartBookingLastYear from "../../components/chart/ChartBookingLastYear";
import ChartBookingMonth from "../../components/chart/ChartBookingMonth";
import ChartBookingWeek from "../../components/chart/ChartBookingWeek";
import ChartBookingYesterday from "../../components/chart/ChartBookingYesterday";
import ChartOrderYear from "../../components/chart/ChartOrderYear";
import ChartOrderLastYear from "../../components/chart/ChartOrderLastYear";
import ChartOrderLastMonth from "../../components/chart/ChartOrderLastMonth";
import ChartOrderLastWeek from "../../components/chart/ChartOrderLastWeek";
import ChartOrderYesterday from "../../components/chart/ChartOrderYesterday";

const ViewStats = ({ columns }) => {
  const [t] = useTranslation("common");

  const navigate = useNavigate();

  const [chart, setChart] = useState("bookings");
  const [timeFrame, setTimeFrame] = useState("yesterday");
  const refreshChart = () => {
    navigate("/stats");
  };
  const handleChangeChart = (e) => {
    setChart(e.value);
    refreshChart();
  };
  const handleChangeTimeFrame = (e) => {
    setTimeFrame(e.value);
    refreshChart();
  };

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
    if (chart === "bookings" && timeFrame === "yesterday") {
      return (
        <ChartBookingYesterday
          aspect={2 / 1}
          title={t("single.chart")}
        />
      );
    }
    if (chart === "orders" && timeFrame === "year") {
      return (
        <ChartOrderYear
          aspect={2 / 1}
          title={t("single.chart")}
        />
      );
    }
    if (chart === "orders" && timeFrame === "lastYear") {
      return (
        <ChartOrderLastYear
          aspect={2 / 1}
          title={t("single.chart")}
        />
      );
    }
    if (chart === "orders" && timeFrame === "month") {
      return (
        <ChartOrderLastMonth
          aspect={2 / 1}
          title={t("single.chart")}
        />
      );
    }
    if (chart === "orders" && timeFrame === "week") {
      return (
        <ChartOrderLastWeek
          aspect={2 / 1}
          title={t("single.chart")}
        />
      );
    }
    if (chart === "orders" && timeFrame === "yesterday") {
      return (
        <ChartOrderYesterday
          title={t("home.title")}
          aspect={2 / 1}
        />
      );
    }
  }

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <div>{t("stats")}</div>
        <div>
          <button
            value={"bookings"}
            onClick={(e) => handleChangeChart(e.target)}
          >
            {t("bookingChart")}
          </button>
          <button
            value={"orders"}
            onClick={(e) => handleChangeChart(e.target)}
          >
            {t("orderChart")}
          </button>
        </div>
        <div>
          <button
            value={"yesterday"}
            onClick={(e) => handleChangeTimeFrame(e.target)}
          >
            {t("yesterday")}
          </button>
          <button
            value={"week"}
            onClick={(e) => handleChangeTimeFrame(e.target)}
          >
            {t("thisWeek")}
          </button>
          <button
            value={"month"}
            onClick={(e) => handleChangeTimeFrame(e.target)}
          >
            {t("thisMonth")}
          </button>
          <button
            value={"lastYear"}
            onClick={(e) => handleChangeTimeFrame(e.target)}
          >
            {t("lastYear")}
          </button>
          <button
            value={"year"}
            onClick={(e) => handleChangeTimeFrame(e.target)}
          >
            {t("thisYear")}
          </button>
        </div>
      </div>
      {displayChart()}
    </div>
  );
};

export default ViewStats;
