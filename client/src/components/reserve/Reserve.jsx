import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useTranslation } from "react-i18next";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data } = useFetch(`/hotels/room/${hotelId}`);
  const [price, setPrice] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const getDate = JSON.parse(
    localStorage.getItem("search")
  );

  const dates = getDate.dates;

  const getDatesInRange = (startDate, endDate) => {
    // plus 1 day to start
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date < end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(
    dates[0].startDate,
    dates[0].endDate
  );

  console.log(
    moment(dates[0].startDate).format("YYYY-MM-DDT00:00:00")
  );

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some(
      (date) => {
        return !!(
          date >=
            moment(dates[0].startDate).format(
              "YYYY-MM-DDT00:00:00"
            ) &&
          date <=
            moment(dates[0].endDate).format(
              "YYYY-MM-DDT00:00:00"
            )
        );
      }
    );
    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    const price = Number(e.target.name);
    // only select 1 room
    if (checked) {
      if (selectedRooms.length === 0) {
        setSelectedRooms([...selectedRooms, value]);
        setPrice(checked ? price : 0);
      } else {
        alert("You can only select 1 room");
        setSelectedRooms([]);
        setPrice({});
        return;
      }
    }
    if (!checked) {
      setSelectedRooms([]);
      setPrice({});
    }
  };

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(checkinDate, checkoutDate) {
    const start = new Date(checkinDate);
    const end = new Date(checkoutDate);
    const timeDiff = Math.abs(
      end.getTime() - start.getTime()
    );
    const diffDays = Math.ceil(
      timeDiff / MILLISECONDS_PER_DAY
    );
    return diffDays;
  }

  const numberNight = dayDifference(
    dates[0].startDate,
    dates[0].endDate
  );

  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await Promise.all(
        selectedRooms.map(async (roomId) => {
          await axios.put(
            `/rooms/availability/${roomId}`,
            {
              dates: alldates,
            }
          );
          const newBooking = {
            roomId: roomId,
            userId: user._id,
            status: "waiting",
            addIn: false,
            type: "day",
            checkinDate: dates[0].startDate,
            checkoutDate: dates[0].endDate,
            employeeId: "628ca6d82d06ce64f49a1882", //default Admin account system
            paymentMethod: "unpaid",
            totalPaid: numberNight * price,
          };

          const bookingId = await axios.post("/bookings", newBooking);

          await axios.post(`/bookings/email/${bookingId.data._id}`);
        })
      );
      setOpen(false);

      navigate("/booking");
    } catch (err) {}
  };

  const [t] = useTranslation("common");

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>{t("selectRoom")}</span>
        {data.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                {t("maxPeople")}({item.maxPeople}{" "}
                {t("adultsAnd")}{" "}
                {Math.round(item.maxPeople / 2)}{" "}
                {t("children")}): <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">{item.price}</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room">
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    name={item.price}
                    checked={selectedRooms.includes(
                      roomNumber._id
                    )}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={handleClick} className="rButton">
          {t("bookingNow")}
        </button>
      </div>
    </div>
  );
};

export default Reserve;
