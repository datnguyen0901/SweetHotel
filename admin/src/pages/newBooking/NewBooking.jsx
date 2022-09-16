import "./newBooking.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import moment from "moment";

const NewBooking = ({ inputs, title }) => {
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

  useEffect(() => {
    if (data) {
      setInfo({
        checkinDate: moment().format("YYYY-MM-DDTHH:mm"),
        checkoutDate: moment().format("YYYY-MM-DDTHH:mm"),
        type: "day",
      });
    }
  }, [data]);

  console.log("info", info);

  const getDatesInRange = (checkinDate, checkoutDate) => {
    const start = new Date(checkinDate);
    const end = new Date(checkoutDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date < end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
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

  const getTimeToHour = (a) => {
    // convert from millisecond to hour
    let b = 1000 * 60 * 60;
    return a / b;
  };

  const alldates = getDatesInRange(
    info.checkinDate,
    info.checkoutDate
  );

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
    const price = Number(e.target.name);
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
    if (info.type === "hour") {
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
    }
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
        userId: user._id,
      }));
    }
  };

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
      roomId: selectedRooms,
      totalPaid: numberNight * price,
    }));
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
        totalPaid: numberNight * price,
      }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const newBooking = {
        ...info,
        checkinDate: moment(info.checkinDate)
          .add(-7, "hours")
          .format("YYYY-MM-DDTHH:mm"),
        checkoutDate: moment(info.checkoutDate)
          .add(-7, "hours")
          .format("YYYY-MM-DDTHH:mm"),
        employeeId: user._id,
        roomId: selectedRooms,
        totalPaid: numberNight * price,
      };

      await axios.post("/bookings", newBooking);

      if (info.type === "day") {
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
      } else {
        await Promise.all(
          selectedRooms.map((roomId) => {
            const res = axios.put(
              `/rooms/availability/${roomId}`,
              {
                dates: info.checkinDate,
              }
            );
            return res.data;
          })
        );
      }

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
          <div className="right          ">
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
                  key={userData.data}
                  getOptionLabel={(option) =>
                    option.fullName + " - " + option.cid
                  }
                  onChange={handleSearch}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("booking.selectBookingUser")}
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="userId"
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
                            {t("booking.createUser")}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </div>

              <div className="formInput">
                <label>{t("booking.roomNumbers")}</label>
                {data.map((item) => (
                  <div className="rSelectRooms">
                    <li>
                      <div className="rTitle">
                        {item.title}
                      </div>
                    </li>

                    {item.roomNumbers?.map((roomNumber) => (
                      <div className="room">
                        <li>
                          <div className="rNumber">
                            <label>
                              {roomNumber.number}
                            </label>
                            <input
                              type="checkbox"
                              name={item.price}
                              key={roomNumber._id}
                              value={roomNumber._id}
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
                  onChange={handleChange}
                />
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

export default NewBooking;
