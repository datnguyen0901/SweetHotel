import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "../list/list.scss";
import ViewBooking from "./ViewBooking";

const ListBooking = ({ columns }) => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <ViewBooking columns={columns} />
      </div>
    </div>
  );
};

export default ListBooking;
