import "../../components/datatable/datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useTranslation } from "react-i18next";
import CircleIcon from "@mui/icons-material/Circle";

const ViewRoomAttendant = ({ columns }) => {
  const [list, setList] = useState([]);
  const [t] = useTranslation("common");

  const navigate = useNavigate();
  // get hotelId from login user by roleId
  const user = JSON.parse(localStorage.getItem("user"));
  // get hotelId from role by roleId
  const role = useFetch(`/roles/${user.roleId}`);
  const hotelId = role.data.hotelId;
  const hotelData = useFetch(`/hotels/find/${hotelId}`);
  const { data, loading, error } = useFetch(
    `/rooms/today/availability/${hotelId}`
  );

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  console.log(data);
  const actionColumn = [
    {
      field: "action",
      headerName: t("available"),
      width: 350,
      renderCell: (params) => {
        return (
          // if data.available === true display "Available" and green dot else display "Not Available"
          <>
            {params.row.available === true ? (
              <div
                className="available"
                style={{
                  color: "Lime",
                  fontSize: "big",
                }}
              >
                <CircleIcon className="statusIcon" />{" "}
                <span className="text">
                  {t("available")}
                </span>
              </div>
            ) : (
              <div
                className="not-available"
                style={{
                  color: "Red",
                  fontSize: "big",
                }}
              >
                <CircleIcon className="statusIcon" />{" "}
                <span className="text">
                  {t("notAvailable")}
                </span>
              </div>
            )}
          </>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        {t("roomAttendants")}
      </div>
      <DataGrid
        className="datagrid"
        rows={list}
        sortModel={[]}
        columns={columns.concat(actionColumn)}
        pageSize={8}
        rowsPerPageOptions={[8]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default ViewRoomAttendant;
