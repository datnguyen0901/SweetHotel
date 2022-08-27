import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SearchContext } from "../../context/SearchContext";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { dispatchDark } = useContext(DarkModeContext);
  const { user } = useContext(AuthContext);
  const orders = useFetch(`/orders`);
  // count orders with status waiting
  const ordersWaiting = orders.data.filter(
    (order) => order.status === "waiting"
  ).length;
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          The best home is our hotel !
        </div>
        <div className="items">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            Vietnamese
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
              <div className="item">{user.username}</div>
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
