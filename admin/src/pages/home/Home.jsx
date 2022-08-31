import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";

const Home = () => {
  const [t] = useTranslation("common");

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="booking" />
          <Widget type="order" />
          <Widget type="earning" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title={t("home.title")} aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">
            {t("home.listTitle")}
          </div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Home;
