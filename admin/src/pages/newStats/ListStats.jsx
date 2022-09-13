import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "../list/list.scss";
import ViewAuditing from "./ViewStats";

const ListStats = ({ columns }) => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <ViewAuditing columns={columns} />
      </div>
    </div>
  );
};

export default ListStats;
