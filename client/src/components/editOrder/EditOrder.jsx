import "./editOder.css";
import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const EditOrder = ({
  setOpen,
  bookingId,
  serviceOrders,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [info, setInfo] = useState({});
  const [price, setPrice] = useState({});
  const [selectedServices, setSelectedServices] = useState(
    []
  );

  const [t] = useTranslation("common");
  const navigate = useNavigate();

  useEffect(() => {
    if (serviceOrders) {
      setInfo({
        bookingId: bookingId,
        employeeId: "628ca6d82d06ce64f49a1882", //default Admin account system
        status: "waiting",
        serviceOrders: serviceOrders,
        paymentMethod: "unpaid",
        totalPaid: 0,
      });
      setSelectedServices(serviceOrders);
    }
  }, [serviceOrders]);

  const total = selectedServices.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
    try {
      const finalServiceOrders = selectedServices.map(
        (item) => ({
          serviceId: item.id,
          quantity: item.quantity,
        })
      );
      const newOrder = {
        bookingId: bookingId,
        employeeId: "628ca6d82d06ce64f49a1882", //default Admin account system
        status: "waiting",
        serviceOrders: finalServiceOrders,
        paymentMethod: "unpaid",
        totalPaid: total,
      };
      // Minus the quantity of service in the service storage when ordered
      serviceOrders.map(async (item) => {
        const service = await axios.get(
          `/services/hotel/edit/${item.id}`
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
            `/services/hotel/storage/${item.id}`,
            newService
          );
        }
      });
      await axios.post("/orders", newOrder);
      navigate("/booking");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="reserveEditOrder">
      <div className="rContainerEditOrder">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <div className="rTitleEditOrder">
          <h1>Your Order</h1>
        </div>
        <div className="rContentEditOrder">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            {selectedServices.map((item) => (
              <tbody>
                <tr key={item.id}>
                  <td>{serviceOrders.indexOf(item) + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.price}$</td>
                  <td>
                    <input
                      id="quantity"
                      name={item.id}
                      onChange={handleChangeService}
                      defaultValue={item.quantity}
                      type="number"
                      min="1"
                      max="99"
                    />
                  </td>
                  {/* display the total price by multiplying the quantity and price */}
                  <td>
                    {item.quantity * item.price + " $"}
                  </td>
                  {/* delete row */}
                  <td>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rDelete"
                    >
                      <DeleteForeverIcon />
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>

        <div className="labelEditOrder">
          <h3>Total: {total}$</h3>
          <h5>
            You will be notified by phone when the hotel
            confirms your order.
          </h5>
        </div>
        <button onClick={handleClick} className="rButton">
          Order Now!
        </button>
      </div>
      {openModal && (
        <EditOrder
          setOpen={setOpenModal}
          bookingId={bookingId}
          dateState={false}
        />
      )}
    </div>
  );
};

export default EditOrder;
