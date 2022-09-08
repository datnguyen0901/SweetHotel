import "./newFinalization.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useEffect, useState } from "react";
import { finalizationInputs } from "../../formSource";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useTranslation } from "react-i18next";
import moment from "moment";

const NewFinalization = ({ inputs, title }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [info, setInfo] = useState({});
  const navigate = useNavigate();
  const bookingId = useParams().productId || "";
  const [totalPaidValue, setTotalPaidValue] = useState(0);
  const [totalUnPaidValue, setTotalUnPaidValue] =
    useState(0);
  const bookingData = useFetch(`/bookings/${bookingId}`);

  const [t] = useTranslation("common");

  const deleteRoomCalendar = async () => {
    await axios.delete(
      `/rooms/availability/delete/${bookingData.data.roomId}`,
      {
        data: {
          dates: [
            moment(bookingData.data.checkinDate)
              .add(1, "days")
              .format("YYYY-MM-DD"),
          ],
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
        setTotalUnPaidValue(booking.data.totalPaid);
        setTotalPaidValue(0);
      } else {
        setTotalPaidValue(booking.data.totalPaid);
        setTotalUnPaidValue(0);
      }
    }
  }, [booking.data]);

  //get all order by bookingId
  const order = useFetch(`/orders/booking/${bookingId}`);
  useEffect(() => {
    if (order.data) {
      order.data.map((item) => {
        if (item.paymentMethod === "unpaid") {
          // sum all unpaid value
          let totalUnPaid = totalUnPaidValue;
          totalUnPaid += item.totalPrice;
          setTotalUnPaidValue(totalUnPaid);
        } else {
          // sum all paid value
          let totalPaid = totalPaidValue;
          totalPaid += item.totalPrice;
          setTotalPaidValue(totalPaid);
        }
      });
    }
  }, [order.data]);

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const newFinalization = {
        ...info,
        bookingId: bookingId,
        paid: totalPaidValue,
        unpaid: totalUnPaidValue,
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
                  placeholder={totalPaidValue}
                  disabled
                />
              </div>
              <div className="formInput">
                <label>{t("totalUnpaid")}</label>
                <input
                  id="unpaid"
                  onChange={handleChange}
                  type="number"
                  placeholder={totalUnPaidValue}
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
