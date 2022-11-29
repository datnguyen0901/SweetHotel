import "./newFinalization.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useTranslation } from "react-i18next";
const NewFinalization = ({ inputs, title }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [info, setInfo] = useState({});
  const navigate = useNavigate();
  const bookingId = useParams().productId || "";
  const [totalPaidValueBooking, setTotalPaidValueBooking] =
    useState(0);
  const [
    totalUnPaidValueBooking,
    setTotalUnPaidValueBooking,
  ] = useState(0);
  const [totalPaidValueOrder, setTotalPaidValueOrder] =
    useState(0);
  const [totalUnPaidValueOrder, setTotalUnPaidValueOrder] =
    useState(0);
  const bookingData = useFetch(`/bookings/${bookingId}`);

  const [t] = useTranslation("common");

  const deleteRoomCalendar = async () => {
    await axios.delete(
      `/rooms/availability/delete/${bookingData.data.roomId}`,
      {
        data: {
          dates: [bookingData.data.checkinDate],
        },
      }
    );
  };

  // get totalPaid if paymentMethod is unpaid
  const booking = useFetch(`/bookings/${bookingId}`);
  useEffect(() => {
    if (booking.data.status === "closed") {
      navigate("/bookings");
      alert("This booking is closed");
    }
    if (booking.data) {
      if (booking.data.paymentMethod === "unpaid") {
        setTotalUnPaidValueBooking(booking.data.totalPaid);
        setTotalPaidValueBooking(0);
      } else {
        setTotalPaidValueBooking(booking.data.totalPaid);
        setTotalUnPaidValueBooking(0);
      }
    }
  }, [booking.data, navigate]);

  //get all order by bookingId
  const order = useFetch(`/orders/booking/${bookingId}`);
  // calculate totalPaid and totalUnPaid from order.data
  useEffect(() => {
    if (order.data) {
      let totalPaid = 0;
      let totalUnPaid = 0;
      order.data.forEach((item) => {
        if (item.paymentMethod === "unpaid") {
          totalUnPaid += item.totalPaid;
        } else {
          totalPaid += item.totalPaid;
        }
      });
      setTotalPaidValueOrder(totalPaid);
      setTotalUnPaidValueOrder(totalUnPaid);
    }
  }, [order.data]);
  // useEffect(() => {
  //   if (order.data) {
  //     order.data.forEach((item) => {
  //       if (item.paymentMethod === "unpaid") {
  //         // sum all unpaid value
  //         let totalUnPaid = totalUnPaidValue;
  //         totalUnPaid += item.totalPaid;
  //         setTotalUnPaidValue(totalUnPaid);
  //       } else {
  //         // sum all paid value
  //         let totalPaid = totalPaidValue;
  //         totalPaid += item.totalPaid;
  //         setTotalPaidValue(totalPaid);
  //       }
  //     });
  //   }
  // }, [order.data, totalPaidValue, totalUnPaidValue]);

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  console.log(info.unpaid);

  const handleClick = async (e) => {
    if (
      info.paymentMethod === undefined ||
      user._id === undefined
    ) {
      alert("Please fill all fields");
    }
    e.preventDefault();
    try {
      const newFinalization = {
        ...info,
        bookingId: bookingId,
        paid: totalPaidValueBooking + totalPaidValueOrder,
        unpaid:
          totalUnPaidValueBooking + totalUnPaidValueOrder,
        employeeId: user._id,
      };

      const closeBooking = {
        status: "closed",
      };

      await axios.post("/finalizations", newFinalization);
      await axios.put(
        `/bookings/${bookingId}`,
        closeBooking
      );
      if (bookingData.data.type === "hour") {
        deleteRoomCalendar();
      }
      navigate("/finalizations");
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
              <div className="formInput">
                <label>{t("bookingId")}</label>
                <input
                  id="bookingId"
                  onChange={handleChange}
                  type="text"
                  placeholder={bookingId}
                  disabled
                />
              </div>
              <div className="formInput">
                <label>{t("totalPaid")}</label>
                <input
                  id="paid"
                  onChange={handleChange}
                  type="number"
                  placeholder={
                    totalPaidValueBooking +
                    totalPaidValueOrder
                  }
                  disabled
                />
              </div>
              <div className="formInput">
                <label>{t("totalUnpaid")}</label>
                <input
                  id="unpaid"
                  onChange={handleChange}
                  type="number"
                  placeholder={
                    totalUnPaidValueBooking +
                    totalUnPaidValueOrder
                  }
                />
              </div>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    key={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}

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

export default NewFinalization;
