import "../../components/datatable/datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const ViewBooking = ({ columns }) => {
  const location = useLocation();
  const [list, setList] = useState([]);
  const { data, loading, error } = useFetch(`/bookings`);

  const getDatesInRange = (checkinDate, checkoutDate) => {
    const start = new Date(checkinDate);
    const end = new Date(checkoutDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date < end) {
      if (date) dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const deleteRoomCalendar = async () => {
    const alldates = getDatesInRange(
      data.checkinDate,
      data.checkoutDate
    );
    await axios.delete(
      `/rooms/availability/delete/${data.roomId}`,
      {
        data: {
          dates: alldates,
        },
      }
    );
  };

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  const handleDelete = async (id) => {
    try {
      if (
        window.confirm(
          "Are you sure you want to delete this item?"
        ) === true
      ) {
        await axios.delete(`/bookings/${id}`);
        deleteRoomCalendar();
        setList(list.filter((item) => item._id !== id));
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
            <Link
              to={`/orders/new/${params.row._id}`}
              className="link"
            >
              <div className="viewButton">Order</div>
            </Link>
            <Link
              to={`/finalizations/new/${params.row._id}`}
              className="link"
            >
              <div className="viewButton">Check-out</div>
            </Link>
            <Link
              to={`/bookings/${params.row._id}`}
              className="link"
            >
              <div className="viewButton">View</div>
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
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Manage Booking
        <Link to={`/bookings/new`} className="link">
          Add New
        </Link>
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
  );
};

export default ViewBooking;
