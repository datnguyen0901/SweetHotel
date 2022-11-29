import "./newRole.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NewRole = ({ inputs, title }) => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(undefined);
  const navigate = useNavigate();
  const { data, loading } = useFetch("/hotels");

  const [t] = useTranslation("common");

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSelect = (e) => {
    setInfo((prev) => ({
      ...prev,
      type: e.target.value,
    }));
  };

  console.log(hotelId);

  const handleClick = async (e) => {
    if (
      info.name === "" ||
      info.type === undefined ||
      hotelId === undefined
    ) {
      alert("Please fill all fields");
    }
    e.preventDefault();
    try {
      const newRole = {
        ...info,
        hotelId,
      };

      await axios.post("/roles", newRole);
      navigate("/roles");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div
            className="right
          "
          >
            <form>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>{t("role.type")}</label>
                <select id="type" onChange={handleSelect}>
                  <option value="" disabled selected>
                    {t("role.selectType")}
                  </option>
                  <option value="Diamond">Diamond</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                </select>
              </div>
              <div className="formInput">
                <label>{t("role.workingHotel")}</label>
                <select
                  id="hotelID"
                  onChange={(e) =>
                    setHotelId(e.target.value)
                  }
                >
                  <option value="" disabled selected>
                    {t("role.selectHotel")}
                  </option>
                  {loading
                    ? "loading"
                    : data &&
                      data.map((hotel) => (
                        <option
                          key={hotel._id}
                          value={hotel._id}
                        >
                          {hotel.name}
                        </option>
                      ))}
                </select>
              </div>
              <div className="formInput">
                <button onClick={handleClick}>
                  {t("user.send")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRole;
