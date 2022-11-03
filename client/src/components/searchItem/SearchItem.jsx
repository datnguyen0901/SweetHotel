import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./searchItem.css";

const SearchItem = ({ item }) => {
  const [t] = useTranslation("common");

  return (
    <div className="searchItem">
      <img src={item.photos[0]} alt="" className="siImg" />
      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>
        <span className="siDistance">
          {item.distance} {t("formCenter")}
        </span>
        <span className="siTaxiOp">{t("freeAirportTransfer")}</span>
        <span className="siSubtitle">
        {t("studioApartment")}
        </span>
        <span className="siFeatures">{item.desc}</span>
        <span className="siCancelOp">
        {t("freeCancellation")}{" "}
        </span>
        <span className="siCancelOpSubtitle">
        {t("cancelLater")}
        </span>
      </div>
      <div className="siDetails">
        {item.rating && (
          <div className="siRating">
            <span>{t("formCenter")}</span>
            <button>{item.rating}</button>
          </div>
        )}
        <div className="siDetailTexts">
          <span className="siPrice">
            ${item.cheapestPrice}
          </span>
          <span className="siTaxOp">
          {t("includeTaxesFees")}
          </span>
          <Link to={`/hotels/${item._id}`}>
            <button className="siCheckButton">
            {t("seeAvailableRooms")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
