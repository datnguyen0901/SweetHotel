import "./newService.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { serviceInputs } from "../../formSource";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewService = () => {
  const [info, setInfo] = useState({});
  const navigate = useNavigate();
  const [file, setFile] = useState("");

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

        const newService = {
          ...info,
          img: url,
        };

        await axios.post("/services", newService);
      } else {
        const newService = {
          ...info,
        };
        await axios.post("/services", newService);
      }
      navigate("/services");
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
          <h1>Add New Service</h1>
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
              {serviceInputs.map((input) => (
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
                <button onClick={handleClick}>Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewService;
