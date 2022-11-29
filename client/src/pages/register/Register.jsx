import { AuthContext } from "../../context/AuthContext";
import "./register.css";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CountryDropdown,
  RegionDropdown,
} from "react-country-region-selector";
import { useTranslation } from "react-i18next";

const Register = () => {
  const [info, setInfo] = useState({});
  const [country, setCountry] = useState(undefined);
  const [region, setRegion] = useState(undefined);
  const [term, setTerm] = useState(false);

  const { loading, error } = useContext(AuthContext);

  const navigate = useNavigate();

  const [t] = useTranslation("common");

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
      country: country,
      city: region,
      status: "pending", // wait for activation from email
      // roleId auto set as customer
      roleId: "62b94302966d649ae7c461de",
    }));
  };

  const handleClickTerm = () => {
    //open file Term.pdf in public folder in a small window
    window.open("/Term.pdf", "_blank");
  };

  const handleSelectTerm = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setTerm(true);
    } else {
      setTerm(false);
    }
  };

  console.log(info);
  console.log(term);

  function checkEmpty() {
    for (let key in info) {
      if (info[key] === "") {
        return true;
      }
    }
    return false;
  }

  const handleClick = async (e) => {
    // check if all fields are filled
    if (checkEmpty()) {
      alert(t("alertFillAllFields"));
      return;
    }

    e.preventDefault();
    try {
      if (term) {
        await axios.post("/auth/register", info);
        alert(t("alertRegisterSuccess"));
        navigate("/login");
      } else {
        alert(t("alertTerms"));
      }
    } catch (error) {
      if (error.response.data.keyValue.email) {
        alert(t("alertEmailExist"));
      } else {
        alert(t("usernameExist"));
      }
      console.log(error.response.data.keyValue);
    }
  };

  return (
    <div className="register">
      <div className="registerContainer">
        <div className="registerTitle">
          <h1>{t("register")}</h1>
        </div>
        <div className="registerForm">
          <form onSubmit={handleClick}>
            <div className="registerForm-group">
              <label className="registerLabel">
                {t("username")}
              </label>
              <input
                type="text"
                placeholder={t("enterUsername")}
                id="username"
                onChange={handleChange}
                className="registerInput"
              />
            </div>

            <div className="registerForm-group">
              <label className="registerLabel">
                {t("fullName")}
              </label>
              <input
                type="text"
                placeholder={t("enterFullName")}
                id="fullName"
                onChange={handleChange}
                className="registerInput"
              />
            </div>

            <div className="registerForm-group">
              <label className="registerLabel">
                {t("gender")}
              </label>
              <select
                id="gender"
                onChange={handleChange}
                className="registerSelect"
              >
                <option value="" disabled selected>
                  {t("selectGender")}
                </option>
                <option value="male"> {t("male")}</option>
                <option value="female">
                  {" "}
                  {t("female")}
                </option>
              </select>
            </div>

            <div className="registerForm-group">
              <label className="registerLabel">
                {t("address")}
              </label>
              <input
                type="text"
                placeholder={t("enterAddress")}
                id="address"
                onChange={handleChange}
                className="registerInput"
              />
            </div>

            <div className="registerForm-group">
              <label className="registerLabel">
                {t("cid")}
              </label>
              <input
                type="text"
                placeholder={t("enterCid")}
                id="cid"
                onChange={handleChange}
                className="registerInput"
              />
            </div>

            <div className="registerForm-group">
              <label className="registerLabel">
                {" "}
                {t("email")}
              </label>
              <input
                type="text"
                placeholder={t("enterEmail")}
                id="email"
                onChange={handleChange}
                className="registerInput"
              />
            </div>

            <div className="registerForm-group">
              <label className="registerLabel">
                {t("country")}
              </label>
              <CountryDropdown
                className="registerSelect"
                value={country}
                onChange={(val) => setCountry(val)}
              />
            </div>

            <div className="registerForm-group">
              <label className="registerLabel">
                {" "}
                {t("city")}
              </label>
              <RegionDropdown
                className="registerSelect"
                country={country}
                value={region}
                onChange={(val) => setRegion(val)}
              />
            </div>

            <div className="registerForm-group">
              <label className="registerLabel">
                {" "}
                {t("phone")}
              </label>
              <input
                type="text"
                placeholder={t("enterPhone")}
                id="phone"
                onChange={handleChange}
                className="registerInput"
              />
            </div>

            <div className="registerForm-group">
              <label className="registerLabel">
                {t("password")}
              </label>
              <input
                type="password"
                placeholder={t("enterPassword")}
                id="password"
                onChange={handleChange}
                className="registerInput"
              />
            </div>
            {/* check box  Term and Condition */}
            <br></br>
            <div className="">
              <input
                type="checkbox"
                id="term"
                className="registerCheckbox"
                onChange={handleSelectTerm}
              />
              {"   "}
              <label
                className="registerTerm"
                onClick={handleClickTerm}
              >
                {t("agreeTerms")}
              </label>
            </div>
            <button
              disabled={loading}
              onClick={handleClick}
              className="registerButton"
            >
              {t("register")}
            </button>
          </form>
        </div>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Register;
