import { AuthContext } from "../../context/AuthContext";
import "./login.css";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const { user, loading, error, dispatch } =
    useContext(AuthContext);

  const navigate = useNavigate();

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
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data.details,
      });
      navigate("/");
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.response.data,
      });
    }
  };

  const [t] = useTranslation("common");

  return (
    <div className="login">
      <div className="loginContainer">
        <div className="loginTitle">
          <h1>{t("login.login")}</h1>
        </div>
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
        <button
          disabled={loading}
          onClick={() => navigate("/resetpassword")}
          className="loginButton"
        >
          {t("forgetPassword")}
        </button>
        <button
          disabled={loading}
          onClick={() => navigate("/register")}
          className="loginButton"
        >
          {t("login.question")}
        </button>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Login;
