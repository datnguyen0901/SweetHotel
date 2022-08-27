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

const EditFinalization = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [info, setInfo] = useState({});
  const navigate = useNavigate();
  const finalizationId = useParams().productId;

  const finalization = useFetch(
    `/finalizations/${finalizationId}`
  );

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

      await axios.put(`/finalizations/${finalizationId}`, newFinalization);
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
          <h1>Add New Finalization</h1>
        </div>
        <div className="bottom">
          <div
            className="right
          "
          >
            <form>
              <div className="formInput">
                <label>Booking ID</label>
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
                <label>Total Paid</label>
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
                <label>Total Unpaid</label>
                <input
                  id="unpaid"
                  onChange={handleChange}
                  type="number"
                  placeholder={info.unpaid}
                  defaultValue={info.unpaid}
                />
              </div>
              {finalizationInputs.map((input) => (
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
                <button onClick={handleClick}>Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFinalization;
