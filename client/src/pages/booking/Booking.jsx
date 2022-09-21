import "./booking.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import {  useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import { useTranslation } from "react-i18next";
import axios from "axios";
import moment from "moment";
import EditBooking from "../../components/editBooking/EditBooking";

const Booking = () => {
  const [bookingId, setBookingId] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const { data, loading } = useFetch(
    `/bookings/user/${user._id}`
  );

  const [t] = useTranslation("common");

  const date = new Date();
  const today = date.toISOString().split("T")[0];

  const navigate = useNavigate();

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

  const deleteRoomCalendar = async (
    roomId,
    checkinDate,
    checkoutDate
  ) => {
    const alldates = getDatesInRange(
      checkinDate,
      checkoutDate
    );
    await axios.delete(
      `/rooms/availability/delete/${roomId}`,
      {
        data: {
          dates: alldates,
        },
      }
    );
  };

  const handleDelete = async (
    id,
    roomId,
    checkinDate,
    checkoutDate,
  ) => {
    try {
      var checkinDate = moment(checkoutDate)
        .add(-7, "hours")
        .format("YYYY-MM-DDTHH:mm");
      var checkoutDate = moment(checkoutDate)
        .add(-7, "hours")
        .format("YYYY-MM-DDTHH:mm");
      if (window.confirm(t("dataTable.confirm")) === true) {
        await axios.delete(`/bookings/${id}`);
        deleteRoomCalendar(
          roomId,
          checkinDate,
          checkoutDate
        );
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (
    id,
  ) => {
    if (user) {
      setBookingId({ id });
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  function displayButton(
    checkinDate,
    checkoutDate,
    id,
    roomId,
    status,
    type,
    paymentMethod
  ) {
    if (checkinDate > today && type === "day") {
      return (
        <>
          <button
            className="booking__button"
            onClick={() =>
              handleClick(
                id,
                roomId,
                checkinDate,
                checkoutDate
              )
            }
          >
            Edit
          </button>
          <button
            className="booking__button"
            onClick={() =>
              handleDelete(
                id,
                roomId,
                checkinDate,
                checkoutDate,
                type
              )
            }
          >
            Delete
          </button>
          {paymentMethod === "unpaid" ? (
            <button className="booking__button">Pay</button>
          ) : null}
        </>
      );
    }
    if (checkinDate < today && status === "open") {
      return (
        <>
          <button className="booking__button">Order</button>
          {paymentMethod === "unpaid" ? (
            <button className="booking__button">Pay</button>
          ) : null}
        </>
      );
    }
  }

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="title">
        <h1>Manage your booking</h1>
      </div>
      {loading ? (
        "loading"
      ) : (
        <div className="bookingContainer">
          {data.map((item, i) => (
            <div class="card1">
              <div class="card_heart">
                <i class="bx bx-bookmark-heart"></i>
              </div>
              <div class="card_img">
                {item.status === "waiting" ? (
                  <img
                    src="https://res.cloudinary.com/sweethotel/image/upload/v1663644532/upload/clockset_z1mzah.png"
                    alt=""
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/sweethotel/image/upload/v1663636905/upload/Gold-Key-PNG-Image_es6cub.png"
                    alt=""
                  />
                )}
              </div>
              <div class="card_title">
                <h3>Room : {item.roomNumber}</h3>
              </div>
              <div class="card_price">
                <h3>
                  {" "}
                  {item.status}{" "}
                  {item.status === "waiting" ? (
                    <CircleIcon
                      className="statusIcon"
                      style={{ color: "gold" }}
                    />
                  ) : (
                    <CircleIcon
                      className="statusIcon"
                      style={{ color: "lime" }}
                    />
                  )}
                </h3>
              </div>
              <div class="card_size">
                <h3>{item._id}</h3>
              </div>
              <div class="card_color">
                {/* format date {item.checkinDate} to dd/mm/yyyy */}
                Check-in Date :{" "}
                <h3>
                  {item.checkinDate.slice(8, 10)}/
                  {item.checkinDate.slice(5, 7)}/
                  {item.checkinDate.slice(0, 4)}
                </h3>
              </div>
              <div class="card_action">
                {displayButton(
                  item.checkinDate,
                  item.checkoutDate,
                  item._id,
                  item.roomId,
                  item.status,
                  item.type,
                  item.paymentMethod
                )}
              </div>
            </div>
          ))}
          <MailList />
          <Footer />
        </div>
      )}
      {openModal && (
        <EditBooking
          setOpen={setOpenModal}
          bookingId={bookingId}
        />
      )}
    </div>
  );
};

export default Booking;
