import "./newService.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useFetch from "../../hooks/useFetch";

const NewService = ({ inputs, title }) => {
  const [info, setInfo] = useState({});
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  // get hotelId from login user by roleId
  const user = JSON.parse(localStorage.getItem("user")) || {
    roleId: "62b94302966d649ae7c461de",
  };
  // get role.name of user
  const hotelId = user.hotelId;
  const checkService = useFetch(
    `/services/hotel/valid/${hotelId}`
  );
  const [t] = useTranslation("common");

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  console.log(info);

  const handleClick = async (e) => {
    e.preventDefault();
    const image = new FormData();
    image.append("file", file);
    image.append("upload_preset", "upload");
    try {
      // check checkService.data is empty
      if (checkService.data.length === 0) {
        const newService = {
          hotelId: hotelId,
          storage: [],
        };
        await axios.post(`/services`, newService);
      }
      if (
        info.name === undefined ||
        info.desc === undefined ||
        info.price === undefined ||
        info.type === undefined
      ) {
        alert("Please fill all fields");
      } else {
        if (file) {
          const uploadRes = await axios.post(
            "https://api.cloudinary.com/v1_1/sweethotel/image/upload",
            image
          );

          const { url } = uploadRes.data;

          const newService = {
            storage: [{ ...info, img: url }],
          };

          await axios.put(
            `/services/hotel/${hotelId}`,
            newService
          );
        } else {
          const newService = {
            storage: [info],
          };
          await axios.put(
            `/services/hotel/${hotelId}`,
            newService
          );
        }
        navigate("/services");
      }
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
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>

          <div
            className="right
          "
          >
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  {t("image")}:{" "}
                  <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) =>
                    setFile(e.target.files[0])
                  }
                  style={{ display: "none" }}
                />
              </div>
              <div className="formInput">
                <label>Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter Service Name"
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Describe</label>
                <input
                  id="desc"
                  type="text"
                  placeholder="Describe Service"
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Price</label>
                <input
                  id="price"
                  type="number"
                  placeholder="Enter Price without currency"
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Type</label>
                <input
                  id="type"
                  type="text"
                  placeholder="Enter Service Type like: food, drink, etc"
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  placeholder="Enter Service Quantity"
                  onChange={handleChange}
                />
              </div>

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

export default NewService;
