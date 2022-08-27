import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  CountryDropdown,
  RegionDropdown,
} from "react-country-region-selector";

const EditHotel = () => {
  const hotel = useParams();
  const id = hotel.hotelId;
  const navigate = useNavigate();
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);
  const [country, setCountry] = useState(undefined);
  const [region, setRegion] = useState(undefined);

  const { data, loading, error } = useFetch("/rooms");
  const dataHotel = useFetch(`/hotels/find/${id}`);

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  //set rooms to the rooms of the hotel
  useEffect(() => {
    if (dataHotel.data) {
      setRooms(dataHotel.data.rooms);
      setCountry(dataHotel.data.country);
      setRegion(dataHotel.data.city);
    }
  }, [dataHotel.data]);
  // set features to the features of the hotel
  useEffect(() => {
    if (dataHotel.data) {
      setInfo(dataHotel.data);
    }
  }, [dataHotel.data]);

  const handleSelect = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRooms(value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const list = await Promise.all(
        Object.values(files).map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "upload");
          const uploadRes = await axios.post(
            "https://api.cloudinary.com/v1_1/lamadev/image/upload",
            data
          );

          const { url } = uploadRes.data;
          return url;
        })
      );

      const EditHotel = {
        ...info,
        rooms,
        photos: list,
      };

      await axios.put(
        `/hotels/${dataHotel.data._id}`,
        EditHotel
      );
      navigate("/hotels");
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
          <h1>Edit Hotel</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files
                  ? URL.createObjectURL(files)
                  : dataHotel.data.img
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image:{" "}
                  <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
              </div>

              {hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={dataHotel.data[input.id]}
                    defaultValue={dataHotel.data[input.id]}
                  />
                </div>
              ))}

              <div className="formInput">
                <label className="label">Country</label>
                <CountryDropdown
                  className="select"
                  value={country}
                  onChange={(val) => setCountry(val)}
                />
              </div>

              <div className="formInput">
                <label className="label">City</label>
                <RegionDropdown
                  className="select"
                  country={country}
                  value={region}
                  onChange={(val) => setRegion(val)}
                />
              </div>
              <div className="formInput">
                <label>Featured</label>
                <select
                  id="featured"
                  onChange={handleChange}
                  value={info.featured}
                >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              <div className="selectRooms">
                <label>Rooms</label>
                <select
                  id="rooms"
                  multiple
                  onChange={handleSelect}
                  value={rooms}
                >
                  {loading
                    ? "loading"
                    : data &&
                      data.map((room) => (
                        <option
                          key={room._id}
                          value={room._id}
                        >
                          {room.title}
                        </option>
                      ))}
                </select>
              </div>
              <button onClick={handleClick}>Edit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHotel;
