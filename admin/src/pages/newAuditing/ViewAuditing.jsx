import "../../components/datatable/datatable.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Chart from "../../components/chart/Chart";
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

const ViewAuditing = ({ columns }) => {
  const [t] = useTranslation("common");

  const navigate = useNavigate();

  const [timeFrame, setTimeFrame] = useState("today");
  const refreshChart = () => {
    navigate("/auditing");
  };

  const handleChangeTimeFrame = (e) => {
    setTimeFrame(e.value);
    refreshChart();
  };

  function displayChart() {}

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <div>{t("Auditings")}</div>
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
