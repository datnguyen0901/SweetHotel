import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import HotelIcon from "@mui/icons-material/Hotel";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import PaidIcon from "@mui/icons-material/Paid";
import StoreIcon from "@mui/icons-material/Store";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { dispatchDark } = useContext(DarkModeContext);
  const { loading, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      await axios.get("/auth/logout");
      dispatch({ type: "LOGOUT" });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // get pathname to show active className
  const pathname = window.location.pathname;

  const [t, i18n] = useTranslation("common");

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">SweetHotel</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">{t("sidebar.main.main")}</p>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span
                className={pathname == `/` ? "active" : ""}
              >
                {t("sidebar.main.dashboard")}
              </span>
            </li>
          </Link>
          <p className="title">
            {t("sidebar.lists.lists")}
          </p>
          <Link
            to="/users"
            style={{ textDecoration: "none" }}
          >
            <li>
              <PersonOutlineIcon className="icon" />
              <span
                className={
                  pathname == `/users` ? "active" : ""
                }
              >
                {t("sidebar.lists.Users")}
              </span>
            </li>
          </Link>
          <Link
            to="/roles"
            style={{ textDecoration: "none" }}
          >
            <li>
              <ManageAccountsIcon className="icon" />
              <span
                className={
                  pathname == `/roles` ? "active" : ""
                }
              >
                {t("sidebar.lists.Roles")}
              </span>
            </li>
          </Link>
          <Link
            to="/hotels"
            style={{ textDecoration: "none" }}
          >
            <li>
              <StoreIcon className="icon" />
              <span
                className={
                  pathname == `/hotels` ? "active" : ""
                }
              >
                {t("sidebar.lists.Hotels")}
              </span>
            </li>
          </Link>
          <Link
            to="/rooms"
            style={{ textDecoration: "none" }}
          >
            <li>
              <CreditCardIcon className="icon" />
              <span
                className={
                  pathname == `/rooms` ? "active" : ""
                }
              >
                {t("sidebar.lists.Rooms")}
              </span>
            </li>
          </Link>
          <Link
            to="/bookings"
            style={{ textDecoration: "none" }}
          >
            <li>
              <HotelIcon className="icon" />
              <span
                className={
                  pathname == `/bookings` ? "active" : ""
                }
              >
                {t("sidebar.lists.Bookings")}
              </span>
            </li>
          </Link>
          <Link
            to="/orders"
            style={{ textDecoration: "none" }}
          >
            <li>
              <RoomServiceIcon className="icon" />
              <span
                className={
                  pathname == `/orders` ? "active" : ""
                }
              >
                {t("sidebar.lists.Orders")}
              </span>
            </li>
          </Link>
          <Link
            to="/services"
            style={{ textDecoration: "none" }}
          >
            <li>
              <RoomPreferencesIcon className="icon" />
              <span
                className={
                  pathname == `/services` ? "active" : ""
                }
              >
                {t("sidebar.lists.Services")}
              </span>
            </li>
          </Link>
          <Link
            to="/finalizations"
            style={{ textDecoration: "none" }}
          >
            <li>
              <PaidIcon className="icon" />
              <span
                className={
                  pathname == `/finalizations`
                    ? "active"
                    : ""
                }
              >
                {t("sidebar.lists.Finalizations")}
              </span>
            </li>
          </Link>
          <Link
            to="/roomAttendants"
            style={{ textDecoration: "none" }}
          >
            <li>
              <CleaningServicesIcon className="icon" />
              <span
                className={
                  pathname == `/roomAttendants`
                    ? "active"
                    : ""
                }
              >
                {t("roomAttendants")}
              </span>
            </li>
          </Link>
          <p className="title">
            {t("sidebar.useful.useful")}
          </p>
          <Link
            to="/auditing"
            style={{ textDecoration: "none" }}
          >
            <li>
              <AccountBalanceIcon className="icon" />
              <span
                className={
                  pathname == `/auditing` ? "active" : ""
                }
              >
                {t("sidebar.useful.Auditing")}
              </span>
            </li>
          </Link>
          <li>
            <InsertChartIcon className="icon" />
            <span
              className={
                pathname == `/stats` ? "active" : ""
              }
            >
              {t("sidebar.useful.Stats")}
            </span>
          </li>
          <Link
            to="/orders"
            style={{ textDecoration: "none" }}
          >
            <li>
              <NotificationsNoneIcon className="icon" />
              <span>
                {t("sidebar.useful.Notifications")}
              </span>
            </li>
          </Link>
          <p className="title">{t("sidebar.user.user")}</p>
          <Link
            to="/single"
            style={{ textDecoration: "none" }}
          >
            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span
                className={
                  pathname == `/single` ? "active" : ""
                }
              >
                {t("sidebar.user.profile")}
              </span>
            </li>
          </Link>
          <li disabled={loading} onClick={handleClick}>
            <ExitToAppIcon className="icon" />
            <span>{t("sidebar.user.logout")}</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatchDark({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatchDark({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
