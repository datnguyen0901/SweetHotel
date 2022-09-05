import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState([]);
  const { data, loading, error } = useFetch(`/${path}`);

  useEffect(() => {
    setList(data);
  }, [data]);

  const [t] = useTranslation("common");

  const handleDelete = async (id) => {
    try {
      if (window.confirm(t("dataTable.confirm")) === true) {
        await axios.delete(`/${path}/${id}`);
        setList(list.filter((item) => item._id !== id));
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
        sortModel={[
          {
            field: "createdAt",
            sort: "desc",
          },
        ]}
        columns={columns.concat(actionColumn)}
        pageSize={8}
        rowsPerPageOptions={[8]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;
