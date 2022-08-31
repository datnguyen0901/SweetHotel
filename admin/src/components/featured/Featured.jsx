import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import useFetch from "../../hooks/useFetch";
import { useTranslation } from "react-i18next";

const Featured = () => {
  const userId = JSON.parse(
    localStorage.getItem("user")
  )._id;
  // for finalizations data
  // get total of bookings if paymentMethod in bookings is cash or online from this month
  const totalBookingsPaidThisMonth = useFetch(
    `/bookings/income/now`
  ).data;

  // get total of bookings if paymentMethod in bookings is cash or online from last month
  const totalBookingsPaidLastMonth = useFetch(
    `/bookings/income/last`
  ).data;

  // get total of orders if paymentMethod in orders is cash or online from this month
  const totalOrdersPaidThisMonth = useFetch(
    `/orders/income/now`
  ).data;

  // get total of orders if paymentMethod in orders is cash or online from last month
  const totalOrdersPaidLastMonth = useFetch(
    `/orders/income/last`
  ).data;

  // get total of finalizations if paymentMethod in orders is cash or online from this month
  const totalFinalizationsPaidThisMonth = useFetch(
    `/finalizations/income/now`
  ).data;

  // get total of orders if paymentMethod in orders is cash or online from last month
  const totalFinalizationsPaidLastMonth = useFetch(
    `/finalizations/income/last`
  ).data;

  const totalThisMonth =
    (totalBookingsPaidThisMonth +
      totalOrdersPaidThisMonth +
      totalFinalizationsPaidThisMonth) /
    1000;

  const totalLastMonth =
    (totalBookingsPaidLastMonth +
      totalOrdersPaidLastMonth +
      totalFinalizationsPaidLastMonth) /
    1000;

  const target = (totalLastMonth * 1.1).toFixed(2);
  const minTarget = (totalLastMonth * 0.9).toFixed(2);
  const incomePercent = (
    (totalThisMonth / target) *
    100
  ).toFixed(2);

  // for income of the logging user
  const incomeBooking = useFetch(
    `bookings/user/income/today/${userId}`
  ).data;
  const incomeOder = useFetch(
    `orders/user/income/today/${userId}`
  ).data;
  const incomeFinalization = useFetch(
    `finalizations/user/income/today/${userId}`
  ).data;
  const totalIncomeToday =
    incomeBooking + incomeOder + incomeFinalization;

  const [t] = useTranslation("common");

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">{t("featured.title")}</h1>
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar
            value={incomePercent}
            text={incomePercent + "%"}
            strokeWidth={5}
          />
        </div>
        <p className="title">
          {t("featured.description1")}
        </p>
        <p className="amount">${totalThisMonth}k</p>
        <p className="desc">{t("featured.description2")}</p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">
              {t("featured.target")}
            </div>
            {totalThisMonth > target ? (
              <div className="itemResult positive">
                <KeyboardArrowUpOutlinedIcon fontSize="small" />
                <div className="resultAmount">
                  ${target}k
                </div>
              </div>
            ) : (
              <div className="itemResult negative">
                <KeyboardArrowDownIcon fontSize="small" />
                <div className="resultAmount">
                  ${target}k
                </div>
              </div>
            )}
          </div>
          <div className="item">
            <div className="itemTitle">
              {t("featured.yourincome")}
            </div>
            <div className="itemResult positive">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="resultAmount">
                ${totalIncomeToday}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">
              {t("featured.lastmonth")}
            </div>
            <div className="itemResult positive">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="resultAmount">
                ${totalLastMonth}k
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
