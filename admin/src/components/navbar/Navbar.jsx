import "./navbar.scss";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { dispatchDark } = useContext(DarkModeContext);
  const { user } = useContext(AuthContext);
  const userData = JSON.parse(
    localStorage.getItem("user")
  ) || { roleId: "62b94302966d649ae7c461de" };
  const hotelId = userData.hotelId;
  const orders = useFetch(`/orders/hotel/room/${hotelId}`);
  // count orders with status waiting
  const ordersWaiting = orders.data.filter(
    (order) => order.status === "waiting"
  ).length;
  const navigate = useNavigate();

  const [t, i18n] = useTranslation("common");

  // change className to be active when click
  const handleClick = (e) => {
    i18n.changeLanguage(e.target.id);
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">{t("welcome.title")}</div>
        <div className="items">
          <div
            className={
              i18n.language === "en"
                ? "item english active"
                : "item english"
            }
            onClick={handleClick}
            id="en"
          >
            <LanguageOutlinedIcon className="icon" />
            {t("language.english")}
          </div>
          <div
            className={
              i18n.language === "vn"
                ? "item vietnamese active"
                : "item vietnamese"
            }
            onClick={handleClick}
            id="vn"
          >
            <LanguageOutlinedIcon className="icon" />
            {t("language.vietnamese")}
          </div>
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() =>
                dispatchDark({ type: "TOGGLE" })
              }
            />
          </div>
          <div className="item">
            <NotificationsNoneOutlinedIcon
              className="icon"
              onClick={() => navigate("/orders")}
              style={{}}
            />
            <div className="counter">{ordersWaiting}</div>
          </div>
          <div className="item">
            <ListOutlinedIcon
              className="icon"
              onClick={() => navigate("/single")}
            />
          </div>
          {user ? (
            <>
              <div className="item">{user.fullName}</div>
              <div className="item">
                <img
                  src={user.img}
                  alt=""
                  className="avatar"
                />
              </div>
            </>
          ) : (
            <div className="navItems">
              <button className="navButton">Login</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
