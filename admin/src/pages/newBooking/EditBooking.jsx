import "./newBooking.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";

const EditBooking = ({ inputs, title }) => {
  const booking = useParams();
  const id = booking.bookingId;
  const [info, setInfo] = useState({});
  const [price, setPrice] = useState({});
  const [selectedRooms, setSelectedRooms] = useState([]);

  const [t] = useTranslation("common");

  const navigate = useNavigate();
  // get hotelId from login user by roleId
  const user = JSON.parse(localStorage.getItem("user"));
  // get hotelId from role by roleId
  const role = useFetch(`/roles/${user.roleId}`);
  const hotelId = role.data.hotelId;
  const hotelData = useFetch(`/hotels/find/${hotelId}`);
  const { data } = useFetch(`/hotels/room/${hotelId}`);
  const bookingData = useFetch(`/bookings/${id}`);

  const deleteRoomCalendar = async () => {
    const alldates = getDatesInRange(
      bookingData.data.checkinDate,
      bookingData.data.checkoutDate
    );
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
    window.location.reload(false);
  }

  useEffect(() => {
    if (bookingData.data) {
      setSelectedRooms([bookingData.data.roomId]);
      setInfo({
        roomId: bookingData.data.roomId,
        userId: bookingData.data.userId,
        // checkinDate: plus 1 day more
        checkinDate: moment(bookingData.data.checkinDate)
          .add(1, "days")
          .format("YYYY-MM-DD"),
        checkoutDate: moment(bookingData.data.checkoutDate)
          .add(1, "days")
          .format("YYYY-MM-DD"),

        checkInTime: bookingData.data.checkInTime,
        checkOutTime: bookingData.data.checkOutTime,
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
    info.checkinDate,
    info.checkoutDate
  );

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
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
    setPrice(checked ? price : 0);
    setInfo((prev) => ({
      ...prev,
      totalPaid: numberNight * price,
    }));
  };

  const userData = useFetch(`/users`);

  const handleSearch = (e, value) => {
    if (value) {
      setInfo((prev) => ({
        ...prev,
        userId: value._id,
      }));
    } else {
      setInfo((prev) => ({
        ...prev,
        userId: bookingData.data.userId,
      }));
    }
  };

  const handleChange = (e) => {
    if (info.type === "hour") {
      //get price of the room
      data.map((item) => {
        item.roomNumbers.map((room) => {
          if (room._id === bookingData.data.roomId) {
            setPrice(item.price);
          }
        });
      });
      // calculate hour by checkInTime and checkOutTime
      const checkInTime = new Date(
        `2021-01-01T${info.checkInTime}:00`
      );
      const checkOutTime = new Date(
        `2021-01-01T${info.checkOutTime}:00`
      );
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
      console.log(
        checkInTime,
        checkOutTime,
        hour,
        price,
        priceFirstHour,
        priceNextHour,
        hourNext,
        totalPaidHour
      );
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
        info.checkinDate !==
          moment(bookingData.data.checkinDate)
            .add(1, "days")
            .format("YYYY-MM-DD") ||
        info.checkoutDate !==
          moment(bookingData.data.checkoutDate)
            .add(1, "days")
            .format("YYYY-MM-DD")
      ) {
        deleteRoomCalendar();
        await Promise.all(
          selectedRooms.map((roomId) => {
            const res = axios.put(
              `/rooms/availability/${roomId}`,
              {
                dates: alldates,
              }
            );
            return res.data;
          })
        );
      }

      const EditBooking = {
        ...info,
        employeeId: user._id,
        roomId: selectedRooms,
        totalPaid: numberNight * price || info.totalPaid,
      };

      await axios.put(`/bookings/${id}`, EditBooking);
      navigate("/bookings");
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
                    key={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={info[input.id]}
                    defaultValue={info[input.id]}
                  />
                </div>
              ))}

              <div className="formInput">
                <label>
                  {t("booking.type")}
                  <select
                    id="type"
                    onChange={handleChange}
                    defaultValue={info.type}
                    value={info.type}
                  >
                    <option value="day">
                      {t("booking.day")}
                    </option>
                    <option value="hour">
                      {t("booking.hour")}
                    </option>
                  </select>
                </label>
                <br></br>
                <label>
                  <div>{t("booking.addIn")}</div>
                  <div>
                    <input
                      id="addIn"
                      type="checkbox"
                      onChange={handleCheckAddIn}
                      defaultChecked={
                        bookingData.data.addIn
                      }
                    />
                  </div>
                </label>
              </div>

              <div className="formInput">
                <label>{t("booking.bookingUser")}</label>
                {/* search username from userData */}
                <Autocomplete
                  id="userId"
                  options={userData.data}
                  getOptionLabel={(option) =>
                    option.fullName + " - " + option.cid
                  }
                  onChange={handleSearch}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Do not change if not necessary"
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="userId"
                      defaultValue={info.userId}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {params.InputProps.endAdornment}
                            <DriveFolderUploadOutlinedIcon
                              style={{
                                marginRight: "10px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                navigate("/users");
                              }}
                            />{" "}
                            {t("booking.createuser")}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </div>

              <div className="formInput">
                <label>
                  {t("booking.roomNumbers")}
                  <div className="formInput">
                    <div
                      onClick={refreshPage}
                      className="editRoom"
                    >
                      {t("booking.clickRoom")}
                    </div>
                  </div>
                </label>
                {data.map((item) => (
                  <div className="rSelectRooms">
                    <li key={item.id}>
                      <div className="rTitle">
                        {item.title}
                      </div>
                    </li>

                    {item.roomNumbers?.map((roomNumber) => (
                      <div className="room">
                        <li key={roomNumber._id}>
                          <div className="rNumber">
                            <label>
                              {roomNumber.number}
                            </label>
                            <input
                              type="checkbox"
                              name={item.price}
                              key={roomNumber._id}
                              value={roomNumber._id}
                              defaultChecked={
                                roomNumber._id ===
                                bookingData.data.roomId
                              }
                              onChange={handleSelect}
                              disabled={
                                !isAvailable(roomNumber)
                              }
                            />
                          </div>
                        </li>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="formInput">
                <label>{t("rooms.hotel")}</label>
                <input
                  disabled
                  id="hotelId"
                  type="text"
                  defaultValue={hotelData.data.name}
                />
              </div>

              <div className="formInput">
                <label>{t("booking.total")}</label>
                <input
                  disabled
                  id="totalPaid"
                  type="number"
                  value={info.totalPaid}
                  placeholder={info.totalPaid}
                  onChange={handleChange}
                />
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

export default EditBooking;
