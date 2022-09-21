import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const { user, dispatch, loading } =
    useContext(AuthContext);
  const navigate = useNavigate();
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
                  {user.fullName}
                  {" |"}
                  <select
                    className="accountSelect"
                    onChange={handleChange}
                  >
                    <option value="home">
                      Gold Member
                    </option>
                    <option value="profile">Profile</option>
                    <option value="logout">Logout</option>
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
              <button className="navButton">Login</button>
            </Link>
            <Link
              to="/register"
              style={{ textDecoration: "none" }}
            >
              <button className="navButton">
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
