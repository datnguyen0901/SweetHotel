import "../../components/datatable/datatable.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TableIncomeYear from "../../components/table/TableIncomeYear";
import TableIncomeLastYear from "../../components/table/TableIncomeLastYear";
import TableIncomeLastMonth from "../../components/table/TableIncomeLastMonth";
import TableIncomeLastWeek from "../../components/table/TableIncomeLastWeek";
import TableIncomeYesterday from "../../components/table/TableIncomeYesterday";
import TableIncomeToday from "../../components/table/TableIncomeToday";
import TableRevenueAccountant from "../../components/table/TableRevenueAccountant";
import TableCheckIncomeHotel from "../../components/table/TableCheckIncomeHotel";
import TableCheckIncomeHotelOnline from "../../components/table/TableCheckIncomeHotelOnline";
import useFetch from "../../hooks/useFetch";

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

  const userLogin = JSON.parse(
    localStorage.getItem("user")
  );
  const user = useFetch(
    `/users/employee/${userLogin._id}`
  ).data;
  //get ._id the first item in the user array
  const userIdArray = user.map((user) => user._id);
  // get 1st one
  const userId = userIdArray[0];

  const userLoginInfo = useFetch(
    `/users/${userLogin._id}`
  ).data;
  const role = useFetch(`/roles/${userLoginInfo.roleId}`);
  const permissions = role.data.name;

  const [employee, setEmployee] = useState();
  const handleChangeEmployee = (e) => {
    setEmployee(e.value);
    refreshChart();
  };

  function displayTable() {
    if (timeFrame === "year") {
      return <TableIncomeYear />;
    }
    if (timeFrame === "lastYear") {
      return <TableIncomeLastYear />;
    }
    if (timeFrame === "month") {
      return <TableIncomeLastMonth />;
    }
    if (timeFrame === "week") {
      return <TableIncomeLastWeek />;
    }
    if (timeFrame === "yesterday") {
      return <TableIncomeYesterday />;
    }
    if (timeFrame === "today") {
      if (employee) {
        return <TableIncomeToday userId={employee} />;
      } else {
        return <TableIncomeToday userId={userId} />;
      }
    }
    if (timeFrame === "revenueToday") {
      return <TableRevenueAccountant />;
    }
    if (timeFrame === "checkIncome") {
      if (employee) {
        return <TableCheckIncomeHotel userId={employee} />;
      } else {
        return <TableCheckIncomeHotel userId={userId} />;
      }
    }
    if (timeFrame === "checkOnline") {
      return <TableCheckIncomeHotelOnline />;
    }
  }

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {t("auditing")}

        <div>
          {permissions === "Accountant" ||
            (permissions === "Admin" && (
              <button
                value={"revenueToday"}
                onClick={(e) =>
                  handleChangeTimeFrame(e.target)
                }
              >
                {t("revenueToday")}
              </button>
            ))}
          <button
            value={"checkOnline"}
            onClick={(e) => handleChangeTimeFrame(e.target)}
          >
            {t("checkOnline")}
          </button>
          <button
            value={"checkIncome"}
            onClick={(e) => handleChangeTimeFrame(e.target)}
          >
            {t("checkIncome")}
          </button>
          <button
            value={"today"}
            onClick={(e) => handleChangeTimeFrame(e.target)}
          >
            {t("today")}
          </button>
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
            {t("lastWeek")}
          </button>
          <button
            value={"month"}
            onClick={(e) => handleChangeTimeFrame(e.target)}
          >
            {t("lastMonth")}
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
      {user &&
      (timeFrame === "today" || timeFrame === "checkIncome")
        ? user.map((user) => (
            <button
              value={user._id}
              onClick={(e) =>
                handleChangeEmployee(e.target)
              }
            >
              {user.fullName}
            </button>
          ))
        : null}
      {displayTable()}
    </div>
  );
};

export default ViewAuditing;
