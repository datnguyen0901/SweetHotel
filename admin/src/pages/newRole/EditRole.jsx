import "./newRole.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { roleInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EditRole = ({ inputs, title }) => {
  const product = useParams();
  const id = product.productId;

  const [info, setInfo] = useState({});

  const navigate = useNavigate();
  const { data, loading, error } = useFetch("/hotels");
  const dataRole = useFetch(`/roles/${id}`);

  const [t] = useTranslation("common");

  //set hotelID to the info of the hotel
  useEffect(() => {
    if (dataRole.data) {
      setInfo(dataRole.data);
    }
  }, [dataRole.data]);

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSelect = (e) => {
    setInfo((prev) => ({
      ...prev,
      type: e.target.value,
    }));
  };

  console.log(info);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const newRole = {
        ...info,
      };

      await axios.put(
        `/roles/${dataRole.data._id}`,
        newRole
      );
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
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div
            className="right
          "
          >
            <form>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    placeholder={dataRole.data[input.id]}
                    onChange={handleChange}
                    type={input.type}
                    defaultValue={dataRole.data[input.id]}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>{t("role.type")}</label>
                <select id="type" onChange={handleSelect}>
                  <option disabled selected>
                    {dataRole.data.type}
                  </option>
                  <option value="Diamond">Diamond</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                </select>
              </div>
              <div className="formInput">
                <label>{t("role.workingHotel")}</label>
                <select
                  id="hotelId"
                  onChange={handleChange}
                  value={info.hotelId}
                >
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
                <button onClick={handleClick}>
                  {t("user.edit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRole;
