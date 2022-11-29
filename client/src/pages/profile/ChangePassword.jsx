import { AuthContext } from "../../context/AuthContext";
import "./profile.css";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useFetch from "../../hooks/useFetch";

const ChangePassword = () => {
  const { error } = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState({});
  const [confirmPassword, setConfirmPassword] = useState(
    {}
  );

  const [t] = useTranslation("common");

  // get token from header
  const token = useParams().id;

  //get user id from token
  const info = JSON.parse(atob(token.split(".")[1]));

  const id = info._id;

  const handleClick = () => {
    if (newPassword !== confirmPassword) {
      // alert wrong confirm password
      alert(t("wrongConfirmPassword"));
      return;
    } else {
      // update password
      axios.put(`/users/updatepassword/${id}`, {
        password: newPassword,
      });
      alert(t("changePasswordSuccess"));
      navigate("/");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="profile">
      <div className="profileContainer">
        <div className="registerTitle">
          <h1>{t("changePassword")}</h1>
        </div>
        <div className="registerForm">
          <form>
            <div className="registerForm-group">
              <label className="profileLabel">
                {t("newPassword")} :{" "}
              </label>
              <input
                type="text"
                className="registerInput"
                id="newPassword"
                placeholder={t("enterNewPassword")}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />
            </div>

            <div className="registerForm-group">
              <label className="profileLabel">
                {t("confirmPassword")} :{" "}
              </label>
              <input
                type="text"
                className="registerInput"
                id="newRePassword"
                placeholder={t("enterConfirmPassword")}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />
            </div>
          </form>
        </div>
        <button
          className="registerButton"
          onClick={handleClick}
        >
          {t("changePassword")}
        </button>
        <button
          className="registerButton"
          onClick={() => navigate("/")}
        >
          {t("back")}
        </button>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default ChangePassword;
