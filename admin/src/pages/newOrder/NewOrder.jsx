import "./newOrder.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useEffect, useState } from "react";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import useFetch from "../../hooks/useFetch";
import { useTranslation } from "react-i18next";

const NewOrder = ({ inputs, title }) => {
  // get hotelId from login user by roleId
  const user = JSON.parse(localStorage.getItem("user")) || {
    roleId: "62b94302966d649ae7c461de",
  };
  // get role.name of user
  const hotelId = user.hotelId;
  const [info, setInfo] = useState({});
  const navigate = useNavigate();
  const serviceData = useFetch(
    `/services/hotel/${hotelId}`
  );
  const [selectedServices, setSelectedServices] = useState(
    []
  );
  const bookingId = useParams().productId || "";

  // get totalPaid if paymentMethod is unpaid
  const booking = useFetch(`/bookings/${bookingId}`);
  useEffect(() => {
    if (booking.data.status === "closed") {
      navigate("/bookings");
      alert("This booking is closed");
    }
  }, [booking.data, navigate]);

  const [t] = useTranslation("common");

  const handleSearch = (e, value) => {
    if (value) {
      // check if the value._id is in the array
      if (
        selectedServices.find(
          (item) => item.id === value._id
        )
      ) {
        alert(t("order.alertSelected"));
        return;
      } else {
        setSelectedServices([
          ...selectedServices,
          {
            id: value._id,
            name: value.name,
            price: parseInt(value.price, 10),
            quantity: 1,
          },
        ]);
      }
    }
  };

  const handleChange = (e) => {
    if (bookingId) {
      setInfo((prev) => ({
        ...prev,
        bookingId: bookingId,
      }));
    }
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleChangeService = (e) => {
    const value = e.target.value;
    const id = e.target.name;
    const service = serviceData.data.find(
      (service) => service._id === id
    );
    if (
      value > service.quantity &&
      service.type !== "service"
    ) {
      alert("We only have " + service.quantity);
      window.location.reload();
    }
    // update quantity of service in selectedServices
    setSelectedServices((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (
            value > service.quantity &&
            service.type !== "service"
          ) {
            return {
              ...item,
              quantity: 1,
            };
          } else {
            return {
              ...item,
              quantity: parseInt(value, 10),
            };
          }
        }
        return item;
      })
    );
  };

  const total = selectedServices.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleDelete = (id) => {
    // confirm delete
    alert(t("order.alertDeleted"));
    // delete service in selectedServices
    setSelectedServices((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const serviceOrders = selectedServices.map((item) => ({
      serviceId: item.id,
      quantity: item.quantity,
    }));
    try {
      // Minus the quantity of service in the service storage when ordered
      serviceOrders.map(async (item) => {
        const service = await axios.get(
          `/services/hotel/edit/${item.serviceId}`
        );
        if (
          service.data.quantity < item.quantity &&
          service.data.type !== "service"
        ) {
          alert(
            t("order.alertQuantity1") +
              service.data.name +
              t("order.alertQuantity2")
          );
          return;
        }
        if (service.data.type !== "service") {
          const newService = {
            ...service.data,
            quantity: service.data.quantity - item.quantity,
          };
          await axios.put(
            `/services/hotel/storage/${item.serviceId}`,
            newService
          );
        }
      });
      const newOrder = {
        ...info,
        employeeId: user._id,
        serviceOrders,
        totalPaid: total,
      };
      await axios.post("/orders", newOrder);
      navigate("/orders");
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
                />
              </div>

              <div className="formInput">
                <label>{t("status")}</label>
                <input
                  id="status"
                  onChange={handleChange}
                  type="text"
                  placeholder="waiting/done"
                />
              </div>

              <div className="formInput">
                <label>{t("paymentMethod")}</label>
                <input
                  id="paymentMethod"
                  onChange={handleChange}
                  type="text"
                  placeholder="cash/online"
                />
              </div>

              <div className="formInput">
                <label>{t("note")}</label>
                <input
                  id="note"
                  onChange={handleChange}
                  type="text"
                  placeholder="note here!"
                />
              </div>

              <div className="formInput">
                <label>{t("total")}</label>
                <input
                  id="total"
                  disabled
                  type="text"
                  placeholder={total + " USD"}
                />
              </div>

              <div className="formInput">
                <label>{t("order.selectServices")}</label>
                {/* search service from serviceData */}
                <Autocomplete
                  id="serviceId"
                  options={serviceData.data}
                  key={serviceData.data}
                  getOptionLabel={(option) =>
                    option.name + " - " + option.type
                  }
                  onChange={handleSearch}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("order.choseService")}
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="serviceId"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {params.InputProps.endAdornment}
                            <DriveFolderUploadOutlinedIcon
                              style={{
                                marginRight: "10px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                navigate("/services");
                              }}
                            />{" "}
                            {t("order.createServices")}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </div>

              <table>
                <thead>
                  <tr>
                    <th>{t("no.")}</th>
                    <th>{t("serviceId")}</th>
                    <th>{t("serviceName")}</th>
                    <th>{t("price")}</th>
                    <th>{t("quantity")}</th>
                    <th>{t("totalPrice")}</th>
                  </tr>
                </thead>
                {selectedServices.map((service) => (
                  <tbody>
                    <tr key={service.id}>
                      <td>
                        {selectedServices.indexOf(service) +
                          1}
                      </td>
                      <td>{service.id}</td>
                      <td>{service.name}</td>
                      <td>{service.price}</td>
                      <td>
                        <input
                          id="quantity"
                          name={service.id}
                          onChange={handleChangeService}
                          defaultValue={service.quantity}
                          type="number"
                          min="1"
                        />
                      </td>
                      {/* display the total price by multiplying the quantity and price */}
                      <td>
                        {service.quantity * service.price +
                          " USD"}
                      </td>
                      {/* delete row */}
                      <td>
                        <button
                          onClick={() =>
                            handleDelete(service.id)
                          }
                        >
                          {t("delete")}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>

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

export default NewOrder;
