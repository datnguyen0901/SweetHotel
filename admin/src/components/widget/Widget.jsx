import "./widget.scss";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import useFetch from "../../hooks/useFetch";
import { useTranslation } from "react-i18next";

const Widget = ({ type }) => {
  let data;

  const users = useFetch(`/users`);
  const usersCount = users.data.length;
  // get user created from this month
  const usersCreatedThisMonth = users.data.filter(
    (user) =>
      new Date(user.createdAt).getMonth() ===
        new Date().getMonth() &&
      new Date(user.createdAt).getFullYear() ===
        new Date().getFullYear()
  ).length;
  const usersCreatedPercent = (
    (usersCreatedThisMonth / usersCount) *
    100
  ).toFixed(2);

  const bookings = useFetch(`/bookings`);
  const bookingsCount = bookings.data.length;
  // get bookings created from this month
  const bookingsCreatedThisMonth = bookings.data.filter(
    (booking) =>
      new Date(booking.createdAt).getMonth() ===
        new Date().getMonth() &&
      new Date(booking.createdAt).getFullYear() ===
        new Date().getFullYear()
  ).length;
  //get bookings created from last month
  const bookingsCreatedLastMonth = bookings.data.filter(
    (booking) =>
      new Date(booking.createdAt).getMonth() ===
        new Date().getMonth() - 1 &&
      new Date(booking.createdAt).getFullYear() ===
        new Date().getFullYear()
  ).length;
  const bookingsCreatedPercent = (
    ((bookingsCreatedThisMonth - bookingsCreatedLastMonth) /
      (bookingsCreatedLastMonth ||
        bookingsCreatedThisMonth)) *
    100
  ).toFixed(2);

  const orders = useFetch(`/orders`);
  const ordersCount = orders.data.length;
  // get bookings created from this month
  const ordersCreatedThisMonth = orders.data.filter(
    (order) =>
      new Date(order.createdAt).getMonth() ===
        new Date().getMonth() &&
      new Date(order.createdAt).getFullYear() ===
        new Date().getFullYear()
  ).length;
  // get booking created from last month
  const ordersCreatedLastMonth = orders.data.filter(
    (order) =>
      new Date(order.createdAt).getMonth() ===
        new Date().getMonth() - 1 &&
      new Date(order.createdAt).getFullYear() ===
        new Date().getFullYear()
  ).length;
  const ordersCreatedPercent = (
    ((ordersCreatedThisMonth - ordersCreatedLastMonth) /
      (ordersCreatedLastMonth || ordersCreatedThisMonth)) *
    100
  ).toFixed(2);

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
    totalBookingsPaidThisMonth +
    totalOrdersPaidThisMonth +
    totalFinalizationsPaidThisMonth;

  const totalLastMonth =
    totalBookingsPaidLastMonth +
    totalOrdersPaidLastMonth +
    totalFinalizationsPaidLastMonth;

  const bookingsPaidPercent = (
    ((totalThisMonth - totalLastMonth) /
      (totalLastMonth || totalThisMonth)) *
    100
  ).toFixed(2);

  const [t] = useTranslation("common");

  switch (type) {
    case "user":
      data = {
        title: t("widget.title.user"),
        amount: usersCount,
        diff: usersCreatedPercent,
        isMoney: false,
        link: t("widget.view.user"),
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "booking":
      data = {
        title: t("widget.title.booking"),
        amount: bookingsCreatedThisMonth,
        diff: bookingsCreatedPercent,
        isMoney: false,
        link: t("widget.view.booking"),
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: t("widget.title.order"),
        amount: ordersCreatedThisMonth,
        diff: ordersCreatedPercent,
        isMoney: false,
        link: t("widget.view.order"),
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: t("widget.title.earning"),
        amount: totalThisMonth,
        diff: bookingsPaidPercent,
        isMoney: true,
        link: t("widget.view.earning"),
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(0, 128, 0, 0.2)",
              color: "green",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {data.amount}
        </span>
        <a href={data.title} className="link">
          {data.link}
        </a>
      </div>
      <div className="right">
        {/* if data.diff > 0 */}
        {data.diff > 0 ? (
          <div className="percentage positive">
            {data.diff}%
            <TrendingUpIcon className="icon" />
          </div>
        ) : (
          <div className="percentage negative">
            {data.diff}%
            <TrendingDownIcon className="icon" />
          </div>
        )}
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
