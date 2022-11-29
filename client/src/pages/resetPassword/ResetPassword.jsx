import { AuthContext } from "../../context/AuthContext";
import "./resetPassword.css";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const [email, setEmail] = useState({});

  const { loading, error } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    // verify email
    if (e.target.value.includes("@")) {
      setEmail((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/users/resetpassword/email",
        email
      );
      alert(res.data.message);
      navigate("/");
    } catch (error) {
      if (error) alert("Email is not exist!");
      console.log(error);
    }
  };

  const [t] = useTranslation("common");

  return (
    <div className="login">
      <div className="loginContainer">
        <div className="loginTitle">
          <h1>{t("forgetPassword")}</h1>
        </div>
        <input
          type="text"
          placeholder={t("enterEmail")}
          id="email"
          onChange={handleChange}
          className="emailInput"
        />
        <button
          disabled={loading}
          onClick={handleClick}
          className="loginButton"
        >
          {t("sendMail")}
        </button>
        <button
          disabled={loading}
          onClick={() => navigate("/login")}
          className="loginButton"
        >
          {t("loginPage")}
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

export default ResetPassword;
