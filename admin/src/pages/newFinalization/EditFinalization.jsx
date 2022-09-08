import "./newFinalization.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useState } from "react";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { finalizationInputs } from "../../formSource";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";

const EditFinalization = ({ inputs, title }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [info, setInfo] = useState({});
  const navigate = useNavigate();
  const finalizationId = useParams().productId;

  const [t] = useTranslation("common");

  const finalization = useFetch(
    `/finalizations/${finalizationId}`
  );
  const bookingData = useFetch(
    `/bookings/${finalization.data.bookingId}`
  );
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

  useEffect(() => {
    if (finalization.data) {
      setInfo(finalization.data);
    }
  }, [finalization.data]);

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
        employeeId: user._id,
      };

      if (bookingData.data.type === "hour") {
        deleteRoomCalendar();
      }

      await axios.put(
        `/finalizations/${finalizationId}`,
        newFinalization
      );
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
                  placeholder={info.bookingId}
                  defaultValue={info.bookingId}
                  disabled
                />
              </div>
              <div className="formInput">
                <label>{t("totalPaid")}</label>
                <input
                  id="paid"
                  onChange={handleChange}
                  type="number"
                  placeholder={info.paid}
                  defaultValue={info.paid}
                  disabled
                />
              </div>
              <div className="formInput">
                <label>{t("totalUnpaid")}</label>
                <input
                  id="unpaid"
                  onChange={handleChange}
                  type="number"
                  placeholder={info.unpaid}
                  defaultValue={info.unpaid}
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
                    placeholder={info[input.id]}
                    defaultValue={info[input.id]}
                  />
                </div>
              ))}

              <div className="formInput">
                <button onClick={handleClick}>
                  {t("edit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFinalization;
