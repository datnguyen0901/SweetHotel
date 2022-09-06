import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "../list/list.scss";
import ViewRoomAttendant from "./ViewRoomAttendant";

const ListRoomAttendant = ({ columns }) => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <ViewRoomAttendant columns={columns} />
      </div>
    </div>
  );
};

export default ListRoomAttendant;
