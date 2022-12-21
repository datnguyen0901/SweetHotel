import "../../components/datatable/datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useTranslation } from "react-i18next";
import moment from "moment";

const ViewBooking = ({ columns }) => {
  const [list, setList] = useState([]);

  const bookingFailed = useFetch(
    `/bookings/deletebooking/checkindate`
  );
  // get hotelId from login user by roleId
  const user = JSON.parse(localStorage.getItem("user")) || {
    roleId: "62b94302966d649ae7c461de",
  };
  // get role.name of user
  const dataRole = useFetch(`/roles/${user.roleId}`);
  const hotelId = user.hotelId;
  const { data } = useFetch(
    `/bookings/hotel/room/${hotelId}`
  );

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

  const [t] = useTranslation("common");

  const handleClearBooking = async () => {
    try {
      if (bookingFailed.data) {
        bookingFailed.data.forEach((item) => {
          deleteRoomCalendar(
            item.roomId,
            item.checkinDate,
            item.checkoutDate,
            item.type
          );
          handleDeleteForClearBooking(
            item._id,
            item.roomId,
            item.checkinDate,
            item.checkoutDate,
            item.type
          );
        });
      }
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteRoomCalendar = async (
    roomId,
    checkinDate,
    checkoutDate,
    type
  ) => {
    const alldates = getDatesInRange(
      checkinDate,
      checkoutDate
    );
    if (type === "hour") {
      await axios.delete(
        `/rooms/availability/delete/${roomId}`,
        {
          data: {
            dates: [
              moment(checkinDate).format("YYYY-MM-DD"),
            ],
          },
        }
      );
    } else {
      await axios.delete(
        `/rooms/availability/delete/${roomId}`,
        {
          data: {
            dates: alldates,
          },
        }
      );
    }
  };

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  useEffect(() => {
    list.forEach((item) => {
      if (item.checkinDate) {
        item.checkinDate = moment(item.checkinDate)
          .add(-7, "hours")
          .format("YYYY-MM-DD HH:mm");
      }
      if (item.checkoutDate) {
        item.checkoutDate = moment(item.checkoutDate)
          .add(-7, "hours")
          .format("YYYY-MM-DD HH:mm");
      }
    });
  }, [list]);

  const handleDelete = async (
    id,
    roomId,
    checkinDate,
    checkoutDate,
    type
  ) => {
    try {
      if (dataRole) {
        if (dataRole.data.name === "Receptionist") {
          alert(
            "You don't have permission to access this page"
          );
          return <Navigate to="/" />;
        }
      }
      if (window.confirm(t("dataTable.confirm")) === true) {
        await axios.delete(`/bookings/${id}`);
        deleteRoomCalendar(
          roomId,
          checkinDate,
          checkoutDate,
          type
        );
        setList(list.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteForClearBooking = async (
    id,
    roomId,
    checkinDate,
    checkoutDate,
    type
  ) => {
    try {
      await axios.delete(`/bookings/${id}`);
      deleteRoomCalendar(
        roomId,
        checkinDate,
        checkoutDate,
        type
      );
      setList(list.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: t("dataTable.action"),
      width: 350,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/orders/new/${params.row._id}`}
              className="link"
            >
              <div className="viewButton">
                {t("dataTable.order")}
              </div>
            </Link>
            <Link
              to={`/finalizations/new/${params.row._id}`}
              className="link"
            >
              <div className="viewButton">
                {t("dataTable.checkOut")}
              </div>
            </Link>
            <Link
              to={`/bookings/${params.row._id}`}
              className="link"
            >
              <div className="viewButton">
                {t("dataTable.view/edit")}
              </div>
            </Link>
            <div
              className="deleteButton"
              onClick={() =>
                handleDelete(
                  params.row._id,
                  params.row.roomId,
                  params.row.checkinDate,
                  params.row.checkoutDate,
                  params.row.type
                )
              }
            >
              {t("dataTable.delete")}
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        {t("dataTable.manage")}{" "}
        {t("sidebar.lists.Bookings")}
        <Link to={`/bookings/new`} className="link">
          {t("dataTable.add")}
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={columns.concat(actionColumn)}
        sort={[
          {
            field: "status",
            sort: "asc",
          },
          {
            field: "roomNumbers",
            sort: "dsc",
          },
        ]}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
      <button onClick={handleClearBooking}>
        <div className="clearBookingButton">
          Clear Bookings
        </div>
      </button>
    </div>
  );
};

export default ViewBooking;
