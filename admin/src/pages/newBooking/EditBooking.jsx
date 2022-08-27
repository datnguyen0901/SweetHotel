import "./newBooking.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import { bookingInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import { SearchContext } from "../../context/SearchContext";
import { format } from "date-fns";
import moment from "moment";

const EditBooking = () => {
  const booking = useParams();
  const id = booking.bookingId;
  const [info, setInfo] = useState({});
  const [price, setPrice] = useState({});
  const [selectedRooms, setSelectedRooms] = useState([]);

  const navigate = useNavigate();
  // get hotelId from login user by roleId
  const user = JSON.parse(localStorage.getItem("user"));
  // get hotelId from role by roleId
  const role = useFetch(`/roles/${user.roleId}`);
  const hotelId = role.data.hotelId;
  const hotelData = useFetch(`/hotels/find/${hotelId}`);
  const { data, loading, error } = useFetch(
    `/hotels/room/${hotelId}`
  );
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
        checkinDate: moment(
          bookingData.data.checkinDate
        ).format("yyyy-MM-DD"),
        checkoutDate: moment(
          bookingData.data.checkoutDate
        ).format("YYYY-MM-DD"),
        status: bookingData.data.status,
        totalPaid: bookingData.data.totalPaid,
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

  const getTimeToDay = (a) => {
    // convert from millisecond to day
    let b = 1000 * 60 * 60 * 24;
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
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
      roomId: selectedRooms,
      totalPaid: numberNight * price || info.totalPaid,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      if (info.checkinDate >= info.checkoutDate) {
        alert("Checking date must be before checkout date");
      }

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
          <h1>Add New Booking</h1>
        </div>
        <div className="bottom">
          <div
            className="right
          "
          >
            <form>
              {bookingInputs.map((input) => (
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
                <label>Hotel Name</label>
                <input
                  disabled
                  id="hotelId"
                  type="text"
                  defaultValue={hotelData.data.name}
                />
              </div>

              <div className="formInput">
                <label>Booking User</label>
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
                            Create new user
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </div>

              <div className="formInput">
                <label>
                  Select your rooms :
                  <div className="formInput">
                    <div
                      onClick={refreshPage}
                      className="editRoom"
                    >
                      Click here to edit room!
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
                <label>Total Paid by USD</label>
                <input
                  disabled
                  id="totalPaid"
                  type="number"
                  value={numberNight * price}
                  placeholder={info.totalPaid}
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <button onClick={handleClick}>Edit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBooking;
