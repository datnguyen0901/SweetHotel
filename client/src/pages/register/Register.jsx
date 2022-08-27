import { AuthContext } from "../../context/AuthContext";
import "./register.css";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CountryDropdown,
  RegionDropdown,
} from "react-country-region-selector";

const Register = () => {
  const [info, setInfo] = useState({});
  const [gender, setGender] = useState(undefined);
  const [country, setCountry] = useState(undefined);
  const [region, setRegion] = useState(undefined);

  const { user, loading, error, dispatch } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
      country: country,
      city: region,
      gender: gender,
      // roleId auto set as customer
      roleId: "62b94302966d649ae7c461de",
    }));
  };

  const handleClick = async (e) => {
    // check if all fields are filled
    if (!info.gender) {
      alert("Please select your gender");
      return;
    }

    e.preventDefault();
    try {
      await axios.post("/auth/register", info);

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login">
      <div className="loginContainer">
        <div className="title">
          <h1>Register</h1>
        </div>
        <div className="form">
          <form onSubmit={handleClick}>
            <div className="form-group">
              <label className="label">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                id="username"
                onChange={handleChange}
                className="loginInput"
              />
            </div>

            <div className="form-group">
              <label className="label">Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                id="fullName"
                onChange={handleChange}
                className="loginInput"
              />
            </div>

            <div className="form-group">
              <label className="label">Gender</label>
              <select
                id="gender"
                onChange={(e) =>
                  setGender(
                    e.target.options[e.target.selectedIndex]
                      .value
                  )
                }
                className="loginSelect"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Address</label>
              <input
                type="text"
                placeholder="Enter address"
                id="address"
                onChange={handleChange}
                className="loginInput"
              />
            </div>

            <div className="form-group">
              <label className="label">CID/Passport</label>
              <input
                type="text"
                placeholder="Enter CID or Passport"
                id="cid"
                onChange={handleChange}
                className="loginInput"
              />
            </div>

            <div className="form-group">
              <label className="label">Email</label>
              <input
                type="text"
                placeholder="Enter email address"
                id="email"
                onChange={handleChange}
                className="loginInput"
              />
            </div>

            <div className="form-group">
              <label className="label">Country</label>
              <CountryDropdown
                className="loginSelect"
                value={country}
                onChange={(val) => setCountry(val)}
              />
            </div>

            <div className="form-group">
              <label className="label">City</label>
              <RegionDropdown
                className="loginSelect"
                country={country}
                value={region}
                onChange={(val) => setRegion(val)}
              />
            </div>

            <div className="form-group">
              <label className="label">Phone</label>
              <input
                type="text"
                placeholder="Enter Phone Number"
                id="phone"
                onChange={handleChange}
                className="loginInput"
              />
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                id="password"
                onChange={handleChange}
                className="loginInput"
              />
            </div>
          </form>
        </div>
        <button
          disabled={loading}
          onClick={handleClick}
          className="loginButton"
        >
          Register
        </button>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Register;
