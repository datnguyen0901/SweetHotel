import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import {
  CountryDropdown,
  RegionDropdown,
} from "react-country-region-selector";
import { useTranslation } from "react-i18next";

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [country, setCountry] = useState(undefined);
  const [region, setRegion] = useState(undefined);
  const [roleSelect, setRoleSelect] = useState([]);
  const { data, loading } = useFetch(`/roles`);
  const hotel = useFetch(`/hotels`);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const userData = JSON.parse(
    localStorage.getItem("user")
  ) || { roleId: "62b94302966d649ae7c461de" };
  // get role.name of user
  const roleData = useFetch(`/roles/${userData.roleId}`);
  console.log(roleData.data.name, data);
  useEffect(() => {
    if (hotel.data) {
      data.forEach((item) => {
        hotel.data.forEach((hotel) => {
          if (item.hotelId === hotel._id) {
            item.hotelName = hotel.name;
          }
        });
      });
    }
    if (roleData.data) {
      if (roleData.data.name === "Receptionist") {
        // just show Receptionist and Customer in roleSelect
        setRoleSelect(
          data.filter((item) => {
            return (
              item.name === "Receptionist" ||
              item.name === "Customer"
            );
          })
        );
      }
      if (roleData.data.name === "Admin") {
        setRoleSelect(data);
      }
      if (
        roleData.data.name === "Manager" ||
        roleData.data.name === "Owner" ||
        roleData.data.name === "QA"
      ) {
        setRoleSelect(
          data.filter((item) => {
            return (
              item.name === "Receptionist" ||
              item.name === "Customer" ||
              item.name === "Manager" ||
              item.name === "QA"
            );
          })
        );
      }
    }
  }, [hotel.data, data, roleData.data]);

  const handleCheckIsAdmin = (e) => {
    setInfo((prev) => ({
      ...prev,
      isAdmin: e.target.checked,
    }));
  };

  const [t] = useTranslation("common");

  const handleClick = async (e) => {
    // check all fields are filled
    if (
      info.name === "" ||
      info.email === "" ||
      info.password === "" ||
      info.phone === "" ||
      info.address === "" ||
      info.role === "" ||
      country === undefined ||
      region === undefined
    ) {
      alert("Please fill all fields");
    }

    e.preventDefault();
    const image = new FormData();
    image.append("file", file);
    image.append("upload_preset", "upload");

    try {
      if (roleData.data.name === "Receptionist") {
        setInfo((prev) => ({
          ...prev,
          //auto set roleId of the created user is customer
          roleId: "62b94302966d649ae7c461de",
        }));
      }
      if (file) {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/sweethotel/image/upload",
          image
        );

        const { url } = uploadRes.data;

        const newUser = {
          ...info,
          img: url,
          country: country,
          city: region,
          status: "active",
        };
        await axios.post(`/auth/register`, newUser);
      } else {
        const newUser = {
          ...info,
          country: country,
          city: region,
          status: "active",
        };
        await axios.post(`/auth/register`, newUser);
      }
      navigate("/users");
    } catch (error) {
      if (error.response.data.keyValue.email) {
        alert(t("alertEmailExist"));
      } else {
        alert(t("usernameExist"));
      }
      console.log(error);
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
          <div className="right">
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

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                </div>
              ))}

              <div className="formInput">
                <label className="label">
                  <div>{t("user.permission")}</div>
                  <div>
                    <input
                      id="isAdmin"
                      type="checkbox"
                      defaultChecked={info.isAdmin}
                      onChange={handleCheckIsAdmin}
                    />
                  </div>
                </label>
              </div>

              <div className="formInput">
                <label className="label">
                  {t("single.country")}
                </label>
                <CountryDropdown
                  className="select"
                  value={country}
                  onChange={(val) => setCountry(val)}
                />
              </div>

              <div className="formInput">
                <label className="label">
                  {t("single.city")}
                </label>
                <RegionDropdown
                  className="select"
                  country={country}
                  value={region}
                  onChange={(val) => setRegion(val)}
                />
              </div>

              <div className="formInput">
                <label>{t("user.role")}</label>
                <select
                  id="roleId"
                  onChange={handleChange}
                  className="select"
                >
                  <option disabled selected>
                    {t("user.select")}
                  </option>
                  {loading
                    ? "loading"
                    : roleSelect &&
                      roleSelect.map((role) => (
                        <option
                          key={role._id}
                          value={role._id}
                        >
                          {role.name} at {role.hotelName}
                        </option>
                      ))}
                </select>
              </div>
              <div className="formInput">
                <button onClick={handleClick}>
                  {t("user.send")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
