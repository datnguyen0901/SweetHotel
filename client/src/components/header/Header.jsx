import {
  faBed,
  faCalendarDays,
  faPerson,
  faBell,
  faCalendarMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import { DateRange } from "react-date-range";
import React, { useContext, useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

const Header = ({ type }) => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [t] = useTranslation("common");
  const hotelData = useFetch("hotels/getname/city");
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  //get path from the link
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]:
          operation === "i"
            ? options[name] + 1
            : options[name] - 1,
      };
    });
  };

  const { dispatch } = useContext(SearchContext);

  const handleSearchDestination = (e, value) => {
    const city = value.city;
    setDestination(city);
  };

  const handleSearch = () => {
    dispatch({
      type: "NEW_SEARCH",
      payload: { destination, dates, options },
    });
    navigate("/hotels", {
      state: { destination, dates, options },
    });
  };

  return (
    <div className="header">
      <div
        className={
          type === "list"
            ? "headerContainer listMode"
            : "headerContainer"
        }
      >
        <div className="headerList">
          <div
            className={
              path === ""
                ? "headerListItem active"
                : "headerListItem"
            }
            onClick={() => navigate("/")}
          >
            <FontAwesomeIcon icon={faBed} />
            <span>Stays</span>
          </div>
          <div
            className={
              path === "booking"
                ? "headerListItem active"
                : "headerListItem"
            }
            onClick={() => navigate("/booking")}
          >
            <FontAwesomeIcon icon={faCalendarMinus} />
            <span>Booking</span>
          </div>
        </div>
        {type !== "list" && (
          <>
            <h1 className="headerTitle">
              A lifetime of discounts? It's Genius.
            </h1>
            <p className="headerDesc">
              Get rewarded for your travels – unlock instant
              savings of 10% or more with a free SweetHotel
              account
            </p>
            {!user && (
              <button
                className="headerBtn"
                onClick={() => navigate("/login")}
              >
                Sign in / Register
              </button>
            )}
            <div className="headerSearch">
              <div className="headerSearchItem">
                <FontAwesomeIcon
                  icon={faBed}
                  className="headerIcon"
                />
                <Autocomplete
                  id="city"
                  options={hotelData.data}
                  key={hotelData.data}
                  getOptionLabel={(option) => option.city}
                  style={{ width: 250 }}
                  onChange={handleSearchDestination}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="headerSearchText"
                      label="Where are you going?"
                      variant="standard"
                      required
                      id="city"
                      InputProps={{
                        ...params.InputProps,
                      }}
                    />
                  )}
                />
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className="headerIcon"
                />
                <span
                  onClick={() => setOpenDate(!openDate)}
                  className="headerSearchText"
                >{`${format(
                  dates[0].startDate,
                  "MM/dd/yyyy"
                )} to ${format(
                  dates[0].endDate,
                  "MM/dd/yyyy"
                )}`}</span>
                {openDate && (
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) =>
                      setDates([item.selection])
                    }
                    moveRangeOnFirstSelection={false}
                    ranges={dates}
                    className="date"
                    minDate={new Date()}
                  />
                )}
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon
                  icon={faPerson}
                  className="headerIcon"
                />
                <span
                  onClick={() =>
                    setOpenOptions(!openOptions)
                  }
                  className="headerSearchText"
                >{`${options.adult} adult · ${options.children} children · ${options.room} room`}</span>
                {openOptions && (
                  <div className="options">
                    <div className="optionItem">
                      <span className="optionText">
                        Adult
                      </span>
                      <div className="optionCounter">
                        <button
                          disabled={options.adult <= 1}
                          className="optionCounterButton"
                          onClick={() =>
                            handleOption("adult", "d")
                          }
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.adult}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() =>
                            handleOption("adult", "i")
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">
                        Children
                      </span>
                      <div className="optionCounter">
                        <button
                          disabled={options.children <= 0}
                          className="optionCounterButton"
                          onClick={() =>
                            handleOption("children", "d")
                          }
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.children}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() =>
                            handleOption("children", "i")
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">
                        Room
                      </span>
                      <div className="optionCounter">
                        <button
                          disabled={options.room <= 1}
                          className="optionCounterButton"
                          onClick={() =>
                            handleOption("room", "d")
                          }
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.room}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() =>
                            handleOption("room", "i")
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="headerSearchItem">
                <button
                  className="headerBtn"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
