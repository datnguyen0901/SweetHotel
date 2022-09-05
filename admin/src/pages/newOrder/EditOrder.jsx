import "./newOrder.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useState } from "react";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { orderInputs, OrderInputs } from "../../formSource";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import useFetch from "../../hooks/useFetch";
import LoadingScreen from "react-loading-screen";
import { useEffect } from "react";

const EditOrder = () => {
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
        alert("Service already selected!");
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
    // update quantity of service in selectedServices

    setSelectedServices((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: parseInt(value, 10),
          };
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
    alert("Are you sure to delete this service?");
    // Plus back the quantity of service in the service storage when delete the service in selectedServices
    orderData.data.serviceOrders.map(async (item) => {
      const service = await axios.get(
        `/services/${item.serviceId}`
      );
      if (service.data.type !== "service") {
        selectedServices.find((service) => {
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

        const oldQuantity =
          orderData.data.serviceOrders.find(
            (service) =>
              service.serviceId === item.serviceId
          ).quantity;

        if (
          service.data.quantity <
            item.quantity - oldQuantity &&
          service.data.type !== "service"
        ) {
          alert(
            "The quantity of " +
              service.data.name +
              " is not enough!"
          );
          return;
        } else {
          const newOrder = {
            ...info,
            employeeId: user._id,
            serviceOrders,
            totalPrice: total,
          };
          await axios.put(`/orders/${orderId}`, newOrder);
          navigate("/orders");
        }
        if (service.data.type !== "service") {
          const newService = {
            ...service.data,
            quantity:
              service.data.quantity -
              item.quantity +
              oldQuantity,
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
  console.log("Services:", selectedServices);

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Order</h1>
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
                  placeholder={bookingId}
                />
              </div>

              <div className="formInput">
                <label>Status</label>
                <input
                  id="status"
                  onChange={handleChange}
                  type="text"
                  placeholder={orderData.data.status}
                />
              </div>

              <div className="formInput">
                <label>Payment Method</label>
                <input
                  id="paymentMethod"
                  onChange={handleChange}
                  type="text"
                  placeholder={orderData.data.paymentMethod}
                />
              </div>

              <div className="formInput">
                <label>Note</label>
                <input
                  id="note"
                  onChange={handleChange}
                  type="text"
                  placeholder={orderData.data.note}
                />
              </div>

              <div className="formInput">
                <label>Order Total</label>
                <input
                  id="total"
                  disabled
                  type="text"
                  placeholder={total + " USD"}
                />
              </div>

              <div className="formInput">
                <label>Select Services</label>
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
                      label="Choose the service"
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
                            Create new service
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
                    <th>No.</th>
                    <th>Service ID</th>
                    <th>Service Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Price(USD)</th>
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
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>

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

export default EditOrder;
