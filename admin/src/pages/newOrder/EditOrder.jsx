import "./newOrder.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useState } from "react";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import useFetch from "../../hooks/useFetch";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const EditOrder = ({ inputs, title }) => {
  const orderId = useParams().productId;
  const orderData = useFetch(`/orders/${orderId}`);
  const bookingId = orderData.data.bookingId;
  const user = JSON.parse(localStorage.getItem("user"));
  const [info, setInfo] = useState({});
  const navigate = useNavigate();
  const serviceData = useFetch(`/services`);
  const [selectedServices, setSelectedServices] = useState(
    []
  );

  const [t] = useTranslation("common");

  // setSelectedServices by orderData.data.serviceOrders
  useEffect(() => {
    setTimeout(() => {
      if (serviceData.data) {
        if (orderData.data.serviceOrders) {
          setSelectedServices(
            orderData.data.serviceOrders.map((item) => {
              const nameService = serviceData.data.find(
                (service) => service._id === item.serviceId
              ).name;
              const priceService = parseInt(
                serviceData.data.find(
                  (service) =>
                    service._id === item.serviceId
                ).price,
                10
              );
              try {
                return {
                  id: item.serviceId,
                  name: nameService,
                  price: priceService,
                  quantity: item.quantity,
                  maxQuantity: 99,
                };
              } catch (error) {
                return {};
              }
            })
          );
        }
      }
    }, 500);
  }, [serviceData.data, orderData.data]);

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
      return;
    }
    // update quantity of service in selectedServices
    setSelectedServices((prev) =>
      prev.map((item) => {
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
    // Plus back the quantity of service in the service storage when delete the service in selectedServices
    orderData.data.serviceOrders.map(async (item) => {
      const service = await axios.get(
        `/services/${item.serviceId}`
      );
      if (service.data.type !== "service") {
        selectedServices.forEach((service) => {
          if (service.id !== item.serviceId) {
            const service = serviceData.data.find(
              (service) => service._id === item.serviceId
            );
            const newQuantity =
              service.quantity + item.quantity;
            axios.put(`/services/${item.serviceId}`, {
              quantity: newQuantity,
            });
          }
        });
      }
    });
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
          `/services/${item.serviceId}`
        );
        // get old quantity in orderData if not set quantity = 0
        const oldQuantity =
          orderData.data.serviceOrders.find(
            (service) =>
              service.serviceId === item.serviceId
          )
            ? orderData.data.serviceOrders.find(
                (service) =>
                  service.serviceId === item.serviceId
              ).quantity
            : 0;
        if (
          service.data.quantity <
            item.quantity - oldQuantity &&
          service.data.type !== "service"
        ) {
          alert(
            t("order.alertQuantity1") +
              service.data.name +
              t("order.alertQuantity2")
          );
          return;
        } else {
          const newOrder = {
            ...info,
            employeeId: user._id,
            serviceOrders,
            totalPaid: total,
          };
          await axios.put(`/orders/${orderId}`, newOrder);
          navigate("/orders");
        }
        if (service.data.type !== "service") {
          const newService = {
            ...service.data,
            quantity:
              service.data.quantity -
              (item.quantity - oldQuantity),
          };
          await axios.put(
            `/services/${item.serviceId}`,
            newService
          );
        }
      });
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
                  placeholder={orderData.data.status}
                />
              </div>

              <div className="formInput">
                <label>{t("paymentMethod")}</label>
                <input
                  id="paymentMethod"
                  onChange={handleChange}
                  type="text"
                  placeholder={orderData.data.paymentMethod}
                />
              </div>

              <div className="formInput">
                <label>{t("note")}</label>
                <input
                  id="note"
                  onChange={handleChange}
                  type="text"
                  placeholder={orderData.data.note}
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
                  key={serviceData._id}
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
                          max={service.maxQuantity}
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

export default EditOrder;
