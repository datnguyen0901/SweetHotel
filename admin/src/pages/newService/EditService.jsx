import "./newService.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { serviceInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditService = () => {
  const product = useParams();
  const id = product.productId;
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});

  const navigate = useNavigate();
  const { data, loading, error } = useFetch("/hotels");
  const dataService = useFetch(`/services/${id}`);

  //set hotelID to the info of the hotel
  useEffect(() => {
    if (dataService.data) {
      setInfo(dataService.data);
    }
  }, [dataService.data]);

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
    image.append("  ", "upload");
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

        await axios.put(`/services/${id}`, newService);
      } else {
        const newService = {
          ...info,
        };
        await axios.put(`/services/${id}`, newService);
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
                  : dataService.data.img
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
                    placeholder={dataService.data[input.id]}
                    onChange={handleChange}
                    type={input.type}
                    defaultValue={
                      dataService.data[input.id]
                    }
                  />
                </div>
              ))}

              <div className="formInput">
                <button onClick={handleClick}>
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditService;
