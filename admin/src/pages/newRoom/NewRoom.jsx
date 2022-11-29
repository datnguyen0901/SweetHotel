import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NewRoom = ({ inputs, title }) => {
  const { data, loading } = useFetch("/hotels");
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(undefined);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const [t] = useTranslation("common");

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    if (
      info.title === undefined ||
      info.price === undefined ||
      info.maxPeople === undefined ||
      info.desc === undefined ||
      rooms.length === 0 ||
      hotelId === undefined
    ) {
      alert("Please fill all fields");
    }
    e.preventDefault();
    const roomNumbers = rooms
      .split(",")
      .map((room) => ({ number: room }));
    try {
      await axios.post(`/rooms/${hotelId}`, {
        ...info,
        hotelId,
        roomNumbers,
      });
      navigate("/rooms");
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
          <div className="right">
            <form>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>{t("rooms.rooms")}</label>
                <textarea
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="give comma between room numbers."
                />
              </div>
              <div className="formInput">
                <label>{t("rooms.hotel")}</label>
                <select
                  id="hotelId"
                  onChange={(e) =>
                    setHotelId(e.target.value)
                  }
                >
                  <option disabled selected>
                    {t("rooms.selectHotel")}
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
                  {t("send")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
