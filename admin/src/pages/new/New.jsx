import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import {
  CountryDropdown,
  RegionDropdown,
} from "react-country-region-selector";

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [country, setCountry] = useState(undefined);
  const [region, setRegion] = useState(undefined);
  const { data, loading, error } = useFetch(`/roles`);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

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
    //  else {
    //   // check if email is valid
    //   const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //   if (re.test(info.email)) {
    //     // check if password is at least 8 characters long
    //     if (info.password.length >= 8) {
    //       // check if phone is valid
    //       const re = /^[0-9]{10}$/;
    //       if (re.test(info.phone)) {
    //             // check if file is valid
    //             if (file !== "") {
    //               // check if file is an image
    //               const re = /^image\//;
    //               if (re.test(file.type)) {
    //                 // check if file is less than 2MB
    //                 if (file.size <= 2097152) {

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
        await axios.post("/auth/register", newUser);
      } else {
        const newUser = {
          ...info,
          country: country,
          city: region,
        };
        await axios.post("/auth/register", newUser);
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
                  Image:{" "}
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
                <label>User Role</label>
                <select
                  id="roleId"
                  onChange={handleChange}
                  className="select"
                >
                  <option disabled selected>
                    select role of the user
                  </option>
                  {loading
                    ? "loading"
                    : data &&
                      data.map((role) => (
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
                <button onClick={handleClick}>Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
