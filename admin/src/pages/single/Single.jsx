import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import ChartIndividualUser from "../../components/chart/ChartIndividualUser";
import ListIndividualUser from "../../components/table/TableIndividual";
import { useTranslation } from "react-i18next";

const Single = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { data } = useFetch(`/users/${user._id}`);

  const navigate = useNavigate();

  const [t] = useTranslation("common");

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div
              className="editButton"
              onClick={() => navigate(`/users/${user._id}`)}
            >
              {t("single.edit")}
            </div>
            <h1 className="title">{t("single.info")}</h1>
            <div className="item">
              <img
                src={data.img}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">
                  {data.fullName}
                </h1>
                <div className="detailItem">
                  <span className="itemKey">
                    {t("single.email")}:
                  </span>
                  <span className="itemValue">
                    {data.email}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    {t("single.phone")}:
                  </span>
                  <span className="itemValue">
                    {data.phone}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    {t("single.address")}:
                  </span>
                  <span className="itemValue">
                    {data.address}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    {t("single.country")}:
                  </span>
                  <span className="itemValue">
                    {data.country}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <ChartIndividualUser
              aspect={3 / 1}
              title={t("single.chart")}
            />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">{t("single.title")}</h1>
          <ListIndividualUser />
        </div>
      </div>
    </div>
  );
};

export default Single;
