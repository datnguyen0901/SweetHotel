import "./booking.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import { useTranslation } from "react-i18next";
import moment from "moment";
import EditBooking from "../../components/editBooking/EditBooking";
import axios from "axios";
import Payment from "../../components/payment/Payment";

const Booking = () => {
  const [bookingId, setBookingId] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState("editBooking");
  const user = JSON.parse(localStorage.getItem("user"));

  const { data, loading } = useFetch(
    `/bookings/user/${user._id}`
  );

  const [t] = useTranslation("common");

  //get today format YYYY-MM-DDT12:00
  const today = moment().format("YYYY-MM-DDT18:00");

  const navigate = useNavigate();

  // const getDatesInRange = (checkinDate, checkoutDate) => {
  //   const start = new Date(checkinDate);
  //   const end = new Date(checkoutDate);

  //   const date = new Date(start.getTime());

  //   const dates = [];

  //   while (date < end) {
  //     if (date) dates.push(new Date(date).getTime());
  //     date.setDate(date.getDate() + 1);
  //   }

  //   return dates;
  // };

  // const deleteRoomCalendar = async (
  //   roomId,
  //   checkinDate,
  //   checkoutDate
  // ) => {
  //   const alldates = getDatesInRange(
  //     checkinDate,
  //     checkoutDate
  //   );
  //   await axios.delete(
  //     `/rooms/availability/delete/${roomId}`,
  //     {
  //       data: {
  //         dates: alldates,
  //       },
  //     }
  //   );
  // };

  const handleDelete = async (
    id,
    roomId,
    checkinDate,
    checkoutDate
  ) => {
    try {
      alert(t("alertDeleteBooking"));
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOrder = (id) => {
    navigate(`/order/${id}`);
  };

  const handleClick = (id, paymentMethod) => {
    if (user) {
      if (paymentMethod === "unpaid") {
        setPage("editBooking");
        setBookingId({ id });
        setOpenModal(true);
      } else {
        alert(t("alertEditBooking"));
      }
    } else {
      navigate("/login");
    }
  };

  const handlePayment = (id) => {
    if (user) {
      setPage("payment");
      setBookingId({ id });
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  const handleVNPay = (id) => {
    const payment = {
      amount: 100000,
      bookingId: id,
      orderInfo: "Payment for booking",
      orderType: "bookingVNPay",
      locale: "",
    };
    // axios with header
    axios
      .post("/bookings/onlinepayment/vnpay", payment)
      .then((res) => {
        window.location.replace(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
    if (
      checkinDate > today &&
      type === "day" &&
      status === "waiting"
    ) {
      return (
        <>
          <button
            className="booking__button"
            onClick={() => handleClick(id, paymentMethod)}
          >
            {t("edit")}
          </button>
          <button
            className="booking__button"
            onClick={() =>
              handleDelete(
                id,
                roomId,
                checkinDate,
                checkoutDate
              )
            }
          >
            {t("delete")}
          </button>
          {paymentMethod === "unpaid" ? (
            <button
              className="booking__button"
              onClick={() => handlePayment(id)}
            >
              {t("pay")}
            </button>
          ) : null}
        </>
      );
    }
    console.log(checkinDate, today);
    if (checkinDate <= today && type === "day") {
      return (
        <>
          {status === "open" ? (
            <button
              className="booking__button"
              onClick={() => handleOrder(id)}
            >
              {t("orderService")}
            </button>
          ) : null}
          {paymentMethod === "unpaid" ? (
            <button
              className="booking__button"
              onClick={() => handlePayment(id)}
            >
              {t("pay")}
            </button>
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
        <h1>{t("manageBooking")}</h1>
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
                <h3>
                  {t("room")} : {item.roomNumber}
                </h3>
              </div>
              <div class="card_price">
                {item.status === "waiting" ? (
                  <h3>
                    {t("waiting")}{" "}
                    <CircleIcon
                      className="statusIcon"
                      style={{ color: "gold" }}
                    />
                  </h3>
                ) : (
                  <h3>
                    {t("open")}{" "}
                    <CircleIcon
                      className="statusIcon"
                      style={{ color: "lime" }}
                    />
                  </h3>
                )}
              </div>
              <div class="card_size">
                <h3>{item._id}</h3>
              </div>
              <div class="card_color">
                {/* format date {item.checkinDate} to dd/mm/yyyy */}
                {t("checkInDate")} :{" "}
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
      {(openModal && page === "editBooking" && (
        <EditBooking
          setOpen={setOpenModal}
          bookingId={bookingId}
          dateState={true}
        />
      )) ||
        (openModal && page === "payment" && (
          <Payment
            setOpen={setOpenModal}
            bookingId={bookingId}
            handleVNPay={handleVNPay}
          />
        ))}
    </div>
  );
};

export default Booking;
