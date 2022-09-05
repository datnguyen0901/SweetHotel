import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import {
  CountryDropdown,
  RegionDropdown,
} from "react-country-region-selector";
import { useTranslation } from "react-i18next";

const Edit = ({ inputs, title }) => {
  const user = useParams();
  const id = user.userId;
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [country, setCountry] = useState(undefined);
  const [region, setRegion] = useState(undefined);
  const { data, loading, error } = useFetch(`/users/${id}`);
  const dataRole = useFetch(`/roles`);

  const [t] = useTranslation("common");

  //set roleId to the info of the user
  useEffect(() => {
    if (data) {
      setInfo(data);
      setCountry(data.country);
      setRegion(data.city);
    }
  }, [data]);

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const image = new FormData();
    image.append("file", file);
    image.append("upload_preset", "upload");
    try {
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
        };
        await axios.put(`/users/${id}`, newUser);
      } else {
        const newUser = {
          ...info,
          country: country,
          city: region,
        };
        await axios.put(`/users/${id}`, newUser);
      }

      navigate("/users");
    } catch (error) {
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
                file ? URL.createObjectURL(file) : data.img
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
                    placeholder={data[input.id]}
                    id={input.id}
                    defaultValue={data[input.id]}
                  />
                </div>
              ))}

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
                  value={info.roleId}
                >
                  {loading
                    ? "loading"
                    : dataRole.data &&
                      dataRole.data.map((role) => (
                        <option
                          key={role._id}
                          value={role._id}
                        >
                          {role.name}
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

export default Edit;
