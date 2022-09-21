import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EditRoom = ({ inputs, title }) => {
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const product = useParams();
  const id = product.roomId;

  const [t] = useTranslation("common");

  const { data, loading } = useFetch("/hotels");
  const dataRoom = useFetch(`/rooms/${id}`);

  //set hotelID to the info of the hotel
  useEffect(() => {
    if (dataRoom.data) {
      setInfo(dataRoom.data);
    }
  }, [dataRoom.data]);

  //set rooms to the rooms of the hotel
  const listRoomNumbers = dataRoom.data.roomNumbers
    ?.map((room) => room.number)
    .toString();

  useEffect(() => {
    if (listRoomNumbers) {
      setRooms(listRoomNumbers);
    }
  }, [listRoomNumbers]);

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/rooms/${id}`, {
        ...info,
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
                    placeholder={dataRoom.data[input.id]}
                    onChange={handleChange}
                    defaultValue={dataRoom.data[input.id]}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>{t("rooms.rooms")}</label>
                <textarea
                  disabled
                  defaultValue={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="give comma between room numbers."
                />
              </div>
              <div className="formInput">
                <label>{t("rooms.hotel")}</label>
                <select
                  id="hotelId"
                  onChange={handleChange}
                  value={info.hotelId}
                >
                  {loading
                    ? "loading"
                    : data &&
                      data.map((hotel) => (
                        <option
                          hotelId={hotel._id}
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
                  {t("edit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRoom;
