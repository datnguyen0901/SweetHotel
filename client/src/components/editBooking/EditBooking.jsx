import "./editBooking.css";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const EditBooking = ({ setOpen, bookingId }) => {
  const [openModal, setOpenModal] = useState(false);
  const [info, setInfo] = useState({});
  const [price, setPrice] = useState({});
  const [selectedRooms, setSelectedRooms] = useState([]);

  const [t] = useTranslation("common");

  const navigate = useNavigate();

  const id = bookingId.id;
  const bookingData = useFetch(`/bookings/${id}`);

  const hotelId = useFetch(
    `/hotels/gethotelid/${bookingData.data.roomId}`
  ).data;
  const hotelData = useFetch(`/hotels/find/${hotelId}`);
  const { data } = useFetch(`/hotels/room/${hotelId}`);

  useEffect(() => {
    if (bookingData.data) {
      setSelectedRooms([bookingData.data.roomId]);
      setInfo({
        roomId: bookingData.data.roomId,
        userId: bookingData.data.userId,
        // checkinDate: plus 1 day more
        checkinDate: moment(bookingData.data.checkinDate)
          .add(7, "hours")
          .format("YYYY-MM-DDTHH:mm"),
        checkoutDate: moment(bookingData.data.checkoutDate)
          .add(7, "hours")
          .format("YYYY-MM-DDTHH:mm"),
        paymentMethod: bookingData.data.paymentMethod,
        note: bookingData.data.note,
        status: bookingData.data.status,
        totalPaid: bookingData.data.totalPaid,
        type: bookingData.data.type,
      });
    }
  }, [bookingData.data]);

  const getDatesInRange = (checkinDate, checkoutDate) => {
    const start = new Date(checkinDate);
    const end = new Date(checkoutDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date < end) {
      if (date) dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(
    moment(bookingData.data.checkinDate)
      .add(7, "hours")
      .format("YYYY-MM-DDTHH:mm"),
    moment(bookingData.data.checkoutDate)
      .add(7, "hours")
      .format("YYYY-MM-DDTHH:mm")
  );

  const allDatesInfo = getDatesInRange(
    info.checkinDate,
    info.checkoutDate
  );

  const deleteRoomCalendar = async () => {
    await axios.delete(
      `/rooms/availability/delete/${bookingData.data.roomId}`,
      {
        data: {
          dates: alldates,
        },
      }
    );
  };

  function refreshPage() {
    deleteRoomCalendar();
    setOpenModal(true);
  }

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

  const getTimeToHour = (a) => {
    // convert from millisecond to hour
    let b = 1000 * 60 * 60;
    return a / b;
  };

  const numberNight = dayDifference(
    info.checkinDate,
    info.checkoutDate
  );

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some(
      (date) => alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    const price = e.target.name;
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
    setPrice(checked ? price : 0);
    setInfo((prev) => ({
      ...prev,
      totalPaid: numberNight * price,
    }));
  };

  const handleChange = (e) => {
    if (info.type === "hour") {
      //get price of the room
      data.forEach((item) => {
        item.roomNumbers.forEach((room) => {
          if (room._id === bookingData.data.roomId) {
            setPrice(item.price);
          }
        });
      });
      // calculate hour by checkInTime and checkOutTime
      const checkInTime = new Date(info.checkinDate);
      const checkOutTime = new Date(info.checkoutDate);
      const hour = getTimeToHour(
        checkOutTime.getTime() - checkInTime.getTime()
      );
      const priceFirstHour = 0.25 * price; // Fisrt hour is 25% of price
      const priceNextHour = 0.1 * price; // Next hour is 10% of price
      // calculate hour if hour-1 > 0 round up
      const hourNext = Math.ceil(hour - 1);

      // round the money
      const totalPaidHour =
        Math.round(priceFirstHour) +
        Math.round(priceNextHour * hourNext);
      setInfo((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
        roomId: selectedRooms,
        totalPaid: totalPaidHour,
      }));
    } else {
      setInfo((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
        roomId: selectedRooms,
        totalPaid:
          numberNight * price || bookingData.totalPaid,
      }));
    }
  };

  const handleCheckAddIn = (e) => {
    const checked = e.target.checked;
    // checked ? setInfo totalPaid increase 20%
    if (checked) {
      setInfo((prev) => ({
        ...prev,
        addIn: true,
        totalPaid: info.totalPaid * 1.2,
      }));
    } else {
      setInfo((prev) => ({
        ...prev,
        addIn: false,
        totalPaid: bookingData.totalPaid,
      }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      if (info.checkinDate > info.checkoutDate) {
        alert(t("booking.checkDate"));
      }
      if (
        moment(info.checkinDate).format("YYYY-MM-DD") !==
          moment(bookingData.data.checkinDate).format(
            "YYYY-MM-DD"
          ) ||
        moment(info.checkoutDate).format("YYYY-MM-DD") !==
          moment(bookingData.data.checkoutDate).format(
            "YYYY-MM-DD"
          )
      ) {
        deleteRoomCalendar();
        await Promise.all(
          selectedRooms.map((roomId) => {
            const res = axios.put(
              `/rooms/availability/${roomId}`,
              {
                dates: allDatesInfo,
              }
            );
            return res.data;
          })
        );
      }

      const EditBooking = {
        ...info,
        checkinDate: moment(info.checkinDate)
          .add(-7, "hours")
          .format("YYYY-MM-DDTHH:mm"),
        checkoutDate: moment(info.checkoutDate)
          .add(-7, "hours")
          .format("YYYY-MM-DDTHH:mm"),
        employeeId: info.employeeId,
        roomId: selectedRooms,
        totalPaid: info.totalPaid,
      };

      await axios.put(`/bookings/${id}`, EditBooking);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="reserveEditBooking">
      <div className="rContainerEditBooking">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <div className="rTitleEditBooking">
          <h1>{t("booking.editBooking")}</h1>
          <div className="formInput">
            <div onClick={refreshPage} className="editRoom">
              Click here if you want to edit your Booking!
            </div>
          </div>
        </div>
        <div className="rContentEditBooking">
          <div className="labelEditBooking">
            <h3>{t("booking.checkIn")}</h3>
            <input
              type="datetime-local"
              id="checkinDate"
              value={moment(info.checkinDate).format(
                "YYYY-MM-DDTHH:mm"
              )}
              onChange={handleChange}
            />
          </div>
          <div className="labelEditBooking">
            <h3>{t("booking.checkOut")}</h3>
            <input
              type="datetime-local"
              id="checkinDate"
              value={moment(info.checkoutDate).format(
                "YYYY-MM-DDTHH:mm"
              )}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="labelEditBooking">
          <h3>{t("booking.room")}</h3>
          {data.map((item) => (
            <div className="rSelectRoomsBooking">
              <div className="rTitle">{item.title}</div>
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
          ))}
        </div>
        <div className="labelEditBooking">
          <h3>{t("rooms.hotel")}</h3>
          <input
            disabled
            id="hotelId"
            type="text"
            defaultValue={hotelData.data.name}
          />
        </div>
        <div className="labelEditBooking">
          <h3>{t("booking.total")}</h3>
          <input
            disabled
            id="totalPaid"
            type="number"
            value={info.totalPaid}
            placeholder={info.totalPaid}
            onChange={handleChange}
          />
        </div>
        <div className="labelEditBooking">
          <h5>
            Total Price is showed solely for reference to
            help identify your Booking Fee
          </h5>
        </div>
        <button onClick={handleClick} className="rButton">
          Edit
        </button>
      </div>
      {openModal && (
        <EditBooking
          setOpen={setOpenModal}
          bookingId={bookingId}
        />
      )}
    </div>
  );
};

export default EditBooking;