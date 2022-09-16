import "../../components/datatable/datatable.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

const RoomNumbers = ({ columns }) => {
  const [list, setList] = useState([]);
  const product = useParams();
  const id = product.roomId;

  const { data } = useFetch(`/rooms/calendar/${id}`);

  const [t] = useTranslation("common");

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  const handleDelete = async (roomid) => {
    try {
      if (window.confirm(t("dataTable.confirm")) === true) {
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
      headerName: t("dataTable.action"),
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/rooms/calendar/${params.row._id}`}>
              <div className="viewButton">
                {t("dataTable.viewCalendar")}
              </div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              {t("dataTable.delete")}
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
          <h1>{t("calendar")}</h1>
        </div>
        <div className="datatable">
          <div className="datatableTitle">
            {t("manageCalendar")}
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
