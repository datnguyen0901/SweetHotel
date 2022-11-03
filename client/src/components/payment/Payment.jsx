import "./payment.css";
import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";

const Payment = ({ setOpen, bookingId, dateState }) => {
  const [openModal, setOpenModal] = useState(false);
  const [info, setInfo] = useState({});

  const [t, i18n] = useTranslation("common");

  const id = bookingId.id;
  const bookingData = useFetch(`/bookings/${id}`);
  const hotelId = useFetch(
    `/hotels/gethotelid/${bookingData.data.roomId}`
  ).data;
  const hotelData = useFetch(`/hotels/find/${hotelId}`);

  useEffect(() => {
    if (bookingData.data) {
      setInfo({
        roomId: bookingData.data.roomId,
        userId: bookingData.data.userId,
        checkinDate: moment(
          bookingData.data.checkinDate
        ).format("YYYY-MM-DDTHH:mm"),
        checkoutDate: moment(
          bookingData.data.checkoutDate
        ).format("YYYY-MM-DDTHH:mm"),
        paymentMethod: bookingData.data.paymentMethod,
        note: bookingData.data.note,
        status: bookingData.data.status,
        totalPaid: bookingData.data.totalPaid,
        type: bookingData.data.type,
      });
    }
  }, [bookingData.data]);

  function refreshPage() {
    setOpenModal(true);
  }

  // convert usd to vnd
  const convert = (usd) => {
    const vnd = usd * 24000;
    return parseFloat(vnd).toFixed(1);
  };

  const handleVNPay = async () => {
    const payment = {
      amount: convert(info.totalPaid),
      bookingId: id,
      orderInfo: "Payment for booking" + id,
      orderType: "bookingVNPay",
      locale: "",
    };

    await axios
      .post("/bookings/onlinepayment/vnpay", payment)
      .then((res) => {
        window.location.replace(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePaypal = async () => {
    const payment = {
      name: "Payment for booking" + id,
      sku: id,
      price: bookingData.data.totalPaid,
      currency: "USD",
      quantity: 1,
    };
    // axios with header
    await axios
      .post("/bookings/onlinepayment/paypal", payment)
      .then((res) => {
        window.location.replace(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
          <h1>{t("paymentSession")}</h1>
        </div>
        <div className="rContentEditBooking">
          <div className="labelEditBooking">
            <h3>{t("booking.checkInTime")}</h3>
            <input
              type="datetime-local"
              id="checkinDate"
              disabled={dateState}
              value={moment(info.checkinDate).format(
                "YYYY-MM-DDTHH:mm"
              )}
            />
          </div>
          <div className="labelEditBooking">
            <h3>{t("booking.checkOutTime")}</h3>
            <input
              type="datetime-local"
              id="checkoutDate"
              disabled={dateState}
              value={moment(info.checkoutDate).format(
                "YYYY-MM-DDTHH:mm"
              )}
            />
          </div>
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
          <h3>{t("bookingCurrency")}</h3>
          <input
            disabled
            id="totalPaid"
            type="number"
            placeholder={
              i18n.language === "en"
                ? info.totalPaid
                : convert(info.totalPaid)
            }
          />
        </div>
        <div className="labelEditBooking">
          <h5>{t("paymentNote")}</h5>
        </div>
        <button
          onClick={() => handleVNPay()}
          className="rButton"
        >
          {t("vnpay")}
        </button>
        <button
          onClick={() => handlePaypal()}
          className="rButton"
        >
          {t("paypal")}
        </button>
      </div>
      {openModal && (
        <Payment
          setOpen={setOpenModal}
          bookingId={bookingId}
          dateState={false}
        />
      )}
    </div>
  );
};

export default Payment;
