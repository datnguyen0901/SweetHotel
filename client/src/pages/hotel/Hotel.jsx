import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reserve/Reserve";
import { useTranslation } from "react-i18next";

const Hotel = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { data, loading } = useFetch(`/hotels/find/${id}`);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getDate = JSON.parse(
    localStorage.getItem("search")
  );

  const dates = getDate.dates;

  const options = getDate.options;

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(startDate, endDate) {
    //convert startDay and endDay to getTime() format
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    const timeDiff = Math.abs(
      date2.getTime() - date1.getTime()
    );
    const diffDays = Math.ceil(
      timeDiff / MILLISECONDS_PER_DAY
    );
    return diffDays;
  }

  const days = dayDifference(
    dates[0].endDate,
    dates[0].startDate
  );

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber =
        slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber =
        slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const handleClick = () => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  const [t] = useTranslation("common");

  return (
    <div>
      <Navbar />
      <Header type="list" />
      {loading ? (
        "loading"
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />
              <div className="sliderWrapper">
                <img
                  src={data.photos[slideNumber]}
                  alt=""
                  className="sliderImg"
                />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}
          <div className="hotelWrapper">
            <button
              className="bookNow"
              onClick={handleClick}
            >
              {t("reserveOrBookNow")}
            </button>
            <h1 className="hotelTitle">{data.name}</h1>
            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{data.address}</span>
            </div>
            <span className="hotelDistance">
              {t("excellentLocation")} {data.distance}m{" "}
              {t("fromCenter")}
            </span>
            <span className="hotelPriceHighlight">
              {t("stayOver")} {data.cheapestPrice}{" "}
              {t("propertyFreeAirportTransfer")}
            </span>
            <div className="hotelImages">
              {data.photos?.map((photo, i) => (
                <div className="hotelImgWrapper" key={i}>
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
            </div>
            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">{data.title}</h1>
                <p className="hotelDesc">{data.desc}</p>
              </div>
              <div className="hotelDetailsPrice">
                <h1>
                  {t("perfectFor")} {days}
                  {t("night")}
                </h1>
                <span>{t("callUs")}</span>
                <h2>
                  <b>
                    $
                    {days *
                      data.cheapestPrice *
                      options.room}
                  </b>{" "}
                  ({days} {t("nightStay")})
                </h2>
                <button onClick={handleClick}>
                  {t("reserveOrBookNow")}
                </button>
              </div>
            </div>
          </div>
          <MailList />
          <Footer />
        </div>
      )}
      {openModal && (
        <Reserve setOpen={setOpenModal} hotelId={id} />
      )}
    </div>
  );
};

export default Hotel;
