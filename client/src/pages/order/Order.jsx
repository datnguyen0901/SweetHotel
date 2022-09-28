import "./order.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import EditOrder from "../../components/editOrder/EditOrder";

const Order = () => {
  const [openModal, setOpenModal] = useState(false);
  const [info, setInfo] = useState([]);
  const [selectedServices, setSelectedServices] = useState(
    []
  );
  const [quantity, setQuantity] = useState(1);
  const id = useParams().id;
  const bookingData = useFetch(`/bookings/${id}`);
  const hotelId = useFetch(
    `/hotels/gethotelid/${bookingData.data.roomId}`
  ).data;

  const { data, loading } = useFetch(
    `/services/hotel/${hotelId}`
  );

  // get length of selectedServices
  const ordersWaiting = selectedServices.length;

  useEffect(() => {
    if (data) {
      const food = data.filter(
        (item) => item.type === "food"
      );
      setInfo(food);
    } else {
      window.location.reload();
    }
  }, [data]);

  const handleSelectType = (type) => {
    if (type === "food") {
      // get services by type = food in data
      const food = data.filter(
        (item) => item.type === "food"
      );
      setInfo(food);
    }
    if (type === "drink") {
      // get services by type = drink in data
      const drink = data.filter(
        (item) => item.type === "drink"
      );
      setInfo(drink);
    }
    if (type === "service") {
      // get services by type = service in data
      const service = data.filter(
        (item) => item.type === "service"
      );
      setInfo(service);
    }
  };

  const [t] = useTranslation("common");

  const navigate = useNavigate();

  const handleAddService = (id, price, name) => {
    const newService = {
      id: id,
      name: name,
      price: parseInt(price, 10),
      quantity: parseInt(quantity, 10),
    };
    setSelectedServices([...selectedServices, newService]);
    setQuantity(1);
  };

  const handleServiceOrder = () => {
    if (selectedServices.length > 0) {
      setOpenModal(true);
    } else {
      alert("Please select service");
    }
  };

  console.log(selectedServices);

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="title">
        <h1>Order Services</h1>
      </div>
      <div className="list">
        <div
          className="type"
          onClick={() => handleSelectType("food")}
        >
          <h3>Food</h3>
        </div>{" "}
        <div
          className="type"
          onClick={() => handleSelectType("drink")}
        >
          <h3>Drink</h3>
        </div>{" "}
        <div
          className="type"
          onClick={() => handleSelectType("service")}
        >
          <h3>Service</h3>
        </div>
      </div>
      {loading ? (
        "loading"
      ) : (
        <div className="bookingContainer">
          {info.map((item, i) => (
            <div className="card1">
              <div className="card_heart">
                <i className="bx bx-bookmark-heart"></i>
              </div>
              <div className="card_img">
                <img src={item.img} alt="" />
              </div>
              <div className="card_title">
                <h3>{item.name}</h3>
              </div>
              <div className="card_price">
                <h3>{item.price}$</h3>
              </div>
              <div className="card_size">
                <h3>Describe: {item.desc}</h3>
              </div>
              <div className="card_quantity">
                Select quantity:
                <input
                  type="number"
                  min="1"
                  max="99"
                  defaultValue={1}
                  id="quantity"
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                />
              </div>
              <div className="card_action">
                <button
                  className="booking__button"
                  onClick={() =>
                    handleAddService(
                      item._id,
                      item.price,
                      item.name
                    )
                  }
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            class="icon-button"
            onClick={() => handleServiceOrder()}
          >
            <span class="material-icons">
              <RoomServiceIcon />
            </span>
            <span class="icon-button__badge">
              {ordersWaiting}
            </span>
          </button>
          <MailList />
          <Footer />
        </div>
      )}
      {openModal && (
        <EditOrder
          setOpen={setOpenModal}
          bookingId={id}
          serviceOrders={selectedServices}
        />
      )}
    </div>
  );
};

export default Order;
