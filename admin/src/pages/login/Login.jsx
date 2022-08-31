import { AuthContext } from "../../context/AuthContext";
import "./login.scss";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/navbar/Navbar";

const Login = () => {
  // check if user is logged in
  const checkLogin = JSON.parse(
    localStorage.getItem("user")
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (checkLogin) {
      navigate("/");
    }
  }, [checkLogin]);

  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const { user, loading, error, dispatch } =
    useContext(AuthContext);

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(
        "/auth/login",
        credentials
      );
      if (res.data.isAdmin) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: res.data.details,
        });

        navigate("/");
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: { message: "You are not allowed!" },
        });
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.response.data,
      });
    }
  };

  const [t] = useTranslation("common");

  return (
    <div className="newContainer">
      <Navbar />
      <div className="login">
        <div className="loginContainer">
          <input
            type="text"
            placeholder={t("login.username")}
            id="username"
            onChange={handleChange}
            className="loginInput"
          />
          <input
            type="password"
            placeholder={t("login.password")}
            id="password"
            onChange={handleChange}
            className="loginInput"
          />
          <button
            disabled={loading}
            onClick={handleClick}
            className="loginButton"
          >
            {t("login.login")}
          </button>
          {error && <span>{error.message}</span>}
        </div>
      </div>
    </div>
  );
};

export default Login;
