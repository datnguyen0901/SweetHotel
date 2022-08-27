import "../../components/datatable/datatable.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { userColumns } from "../../datatablesource";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DataGrid } from "@mui/x-data-grid";

const RoomNumbers = ({ columns }) => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const product = useParams();
  const id = product.roomId;

  const { data, loading, error } = useFetch(
    `/rooms/calendar/${id}`
  );

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  const handleDelete = async (roomid) => {
    try {
      if (
        window.confirm(
          "Are you sure you want to delete this item?"
        ) === true
      ) {
        await axios.delete(
          `/rooms/roomNumbers/${id}/${roomid}`
        );
        setList(list.filter((item) => item._id !== roomid));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/rooms/calendar/${params.row._id}`}>
              <div className="viewButton">
                View Calendar
              </div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  // display the calendar to modify the roomNumbers unavailableDates
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Calendar</h1>
        </div>
        <div className="datatable">
          <div className="datatableTitle">
            Manage Room Numbers
          </div>
          <DataGrid
            className="datagrid"
            rows={list}
            columns={columns.concat(actionColumn)}
            pageSize={8}
            rowsPerPageOptions={[8]}
            checkboxSelection
            getRowId={(row) => row._id}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomNumbers;
