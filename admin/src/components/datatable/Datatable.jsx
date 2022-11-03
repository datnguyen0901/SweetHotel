import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import {
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Datatable = ({ columns }) => {
  const location = useLocation();
  // get hotelId from login user by roleId
  const user = JSON.parse(localStorage.getItem("user")) || {
    roleId: "62b94302966d649ae7c461de",
  };
  // get role.name of user
  const dataRole = useFetch(`/roles/${user.roleId}`);
  // get role.name of user
  const hotelId = user.hotelId;
  const path = location.pathname.split("/")[1];

  const [list, setList] = useState([]);
  const { data } = useFetch(`/${path}`);

  const dataOrder = useFetch(
    `/orders/hotel/room/${hotelId}`
  );
  const dataFinalization = useFetch(
    `/finalizations/hotel/room/${hotelId}`
  );
  const dataService = useFetch(
    `/services/hotel/${hotelId}`
  );
  const dataUsers = useFetch(
    `/users/hotel/employee/${user._id}`
  );
  const dataUsersForAdmin = useFetch(`/users`);

  useEffect(() => {
    if (path === "finalizations") {
      setList(dataFinalization.data);
    }
    if (path === "orders") {
      setList(dataOrder.data);
    }
    if (path === "services") {
      setList(dataService.data);
    }
    if (path === "users") {
      if (dataRole.data.name === "Admin") {
        setList(dataUsersForAdmin.data);
      } else {
        setList(dataUsers.data);
      }
    }
    if (
      path !== "finalizations" &&
      path !== "orders" &&
      path !== "services" &&
      path !== "users"
    ) {
      setList(data);
    }
  }, [
    data,
    path,
    dataOrder,
    dataFinalization,
    dataService,
    dataUsers,
    dataUsersForAdmin,
    dataRole,
  ]);

  const [t] = useTranslation("common");

  const handleDelete = async (id) => {
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
        if (path === "services") {
          await axios.delete(
            `/services/hotel/storage/${id}`
          );
        } else {
          await axios.delete(`/${path}/${id}`);
        }
        setList(list.filter((item) => item._id !== id));
        window.location.reload();
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
            {path === "rooms" && (
              <Link
                to={`/${path}/roomnumbers/${params.row._id}`}
              >
                <div className="viewButton">
                  {t("dataTable.roomNumbers")}
                </div>
              </Link>
            )}
            <Link
              to={`/${path}/${params.row._id}`}
              className="link"
            >
              <div className="viewButton">
                {t("dataTable.view/edit")}
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
  return (
    <div className="datatable">
      <div className="datatableTitle">
        {t("dataTable.manage")} {path.toUpperCase()}
        <Link to={`/${path}/new`} className="link">
          {t("dataTable.add")}
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={columns.concat(actionColumn)}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;
