import "./newRole.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { roleInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewRole = () => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(undefined);
  const navigate = useNavigate();
  const { data, loading, error } = useFetch("/hotels");

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  console.log(hotelId);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const newRole = {
        ...info,
        hotelId,
      };

      await axios.post("/roles", newRole);
      navigate("/roles");
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
          <h1>Add New Role</h1>
        </div>
        <div className="bottom">
          <div
            className="right
          "
          >
            <form>
              {roleInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Working Hotel</label>
                <select
                  id="hotelID"
                  onChange={(e) =>
                    setHotelId(e.target.value)
                  }
                >
                  <option disabled selected>
                    choose the hotel of the room
                  </option>
                  {loading
                    ? "loading"
                    : data &&
                      data.map((hotel) => (
                        <option
                          key={hotel._id}
                          value={hotel._id}
                        >
                          {hotel.name}
                        </option>
                      ))}
                </select>
              </div>
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

export default NewRole;
