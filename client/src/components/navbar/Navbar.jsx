import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { user, dispatch, loading } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [t, i18n] = useTranslation("common");
  const handleChange = async (e) => {
    if (e.target.value === "logout") {
      try {
        await axios.get("/auth/logout");
        dispatch({ type: "LOGOUT" });
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
    if (e.target.value === "profile") {
      navigate("/profile");
    } else {
      navigate("/");
    }
  };

  // change className to be active when click
  const handleClick = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link
          to="/"
          style={{
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <span className="logo">Sweet Hotel</span>
        </Link>
        <div className="right">
          <div className="language">
            {/* select language: */}
            <select
              className="accountSelect"
              onChange={handleClick}
            >
              <option value="en">
                {t("language.english")}
              </option>
              <option value="vn">
                {t("language.vietnamese")}
              </option>
            </select>
          </div>
        </div>
        {user ? (
          <>
            <div className="navItems">
              <div className="item">
                <img
                  src={user.img}
                  alt=""
                  className="avatar"
                />
                <label className="username">
                  <select
                    className="accountSelect"
                    onChange={handleChange}
                  >
                    <option disabled selected>
                      {user.fullName}
                    </option>
                    <option value="profile">
                      {t("sidebar.user.profile")}
                    </option>
                    <option value="logout">
                      {t("sidebar.user.logout")}
                    </option>
                  </select>
                </label>
              </div>
            </div>
          </>
        ) : (
          <div className="navItems">
            <Link
              to="/login"
              style={{ textDecoration: "none" }}
            >
              <button className="navButton">
                {t("login.login")}
              </button>
            </Link>
            <Link
              to="/register"
              style={{ textDecoration: "none" }}
            >
              <button className="navButton">
                {t("login.register")}
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
