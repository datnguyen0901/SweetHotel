import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { format, parse } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import { useTranslation } from "react-i18next";

const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(
    location.state.destination
  );
  const [dates, setDates] = useState(location.state.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(
    location.state.options
  );
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);

  const { data, loading, error, reFetch } = useFetch(
    `/hotels?city=${destination}&min=${min || 1}&max=${
      max || 999
    }`
  );

  const [t] = useTranslation("common");

  const handleDate = () => {
    //alert if user want to change date please go back to home page
    alert("Please go back to home page to change date!");
    return;
  };

  const handleClick = () => {
    reFetch();
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">{t("search")}</h1>
            <div className="lsItem">
              <label>{t("destination")}</label>
              <input
                placeholder={destination}
                type="text"
                disabled
              />
            </div>
            <div className="lsItem">
              <label>{t("checkInDate")}</label>
              <span
                onClick={handleDate}
                disabled
              >{`${format(
                dates[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(
                dates[0].endDate,
                "MM/dd/yyyy"
              )}`}</span>
              {openDate && (
                <DateRange
                  disabled
                  onChange={(item) =>
                    setDates([item.selection])
                  }
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>
            <div className="lsItem">
              <label>{t("options")}</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    {t("minPrice")}{" "}
                    <small>{t("perNight")}</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMin(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    {t("maxPrice")}{" "}
                    <small>{t("perNight")}</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) =>
                      setMax(parseInt(e.target.value) + 1)
                    }
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    {t("adults")}
                  </span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                    disabled
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    {t("children")}
                  </span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                    disabled
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    {t("rooms.rooms")}
                  </span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                    disabled
                  />
                </div>
              </div>
            </div>
            <button onClick={handleClick}>
              {t("search")}
            </button>
          </div>
          <div className="listResult">
            {loading ? (
              "loading"
            ) : (
              <>
                {data.map((item) => (
                  <SearchItem item={item} key={item._id} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
