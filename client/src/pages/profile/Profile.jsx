import { AuthContext } from "../../context/AuthContext";
import "./profile.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const Profile = () => {
  const { error } = useContext(AuthContext);

  const userData = JSON.parse(localStorage.getItem("user"));
  const profile = useFetch(`/users/${userData._id}`).data;

  const handleResetPassword = async () => {
    const res = await axios.get(
      `/users/resetpassword/id/${userData._id}`
    );
    window.location.href = res.data;
  };

  const navigate = useNavigate();

  const [t] = useTranslation("common");

  return (
    <div className="profile">
      <div className="profileContainer">
        <div className="registerTitle">
          <h1>{t("profile")}</h1>
        </div>
        <div className="registerForm">
          <form>
            <div className="registerForm-group">
              <label className="profileLabel">
                {t("username")} : {profile.username}
              </label>
            </div>

            <div className="registerForm-group">
              <label className="profileLabel">
                {t("fullName")} : {profile.fullName}
              </label>
            </div>

            <div className="registerForm-group">
              <label className="profileLabel">
                {t("gender")} : {profile.gender}
              </label>
            </div>

            <div className="registerForm-group">
              <label className="profileLabel">
                {t("address")} : {profile.address}
              </label>
            </div>

            <div className="registerForm-group">
              <label className="profileLabel">
                {t("cid")} : {profile.cid}
              </label>
            </div>

            <div className="registerForm-group">
              <label className="profileLabel">
                {" "}
                {t("email")} : {profile.email}
              </label>
            </div>

            <div className="registerForm-group">
              <label className="profileLabel">
                {t("country")} : {profile.country}
              </label>
            </div>

            <div className="registerForm-group">
              <label className="profileLabel">
                {" "}
                {t("city")} : {profile.city}
              </label>
            </div>

            <div className="registerForm-group">
              <label className="profileLabel">
                {" "}
                {t("phone")} : {profile.phone}
              </label>
            </div>

            {/* check box  Term and Condition */}
            <div className="">
              {"   "}
              <label className="registerTerm">
                {t("noteProfile")}
              </label>
            </div>
          </form>
        </div>
        <button
          className="registerButton"
          onClick={handleResetPassword}
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

export default Profile;
