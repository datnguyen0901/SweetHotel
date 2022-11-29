import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircleIcon from "@mui/icons-material/Circle";
import useFetch from "../../hooks/useFetch";
import { useTranslation } from "react-i18next";

const List = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const hotelId = userData.hotelId;
  const rows = useFetch(`/orders/sort/newest/${hotelId}`);

  const [t] = useTranslation("common");

  return (
    <TableContainer component={Paper} className="table">
      <Table
        sx={{ minWidth: 650 }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">
              {t("table.trackId")}
            </TableCell>
            <TableCell className="tableCell">
              {t("table.bookingId")}
            </TableCell>
            <TableCell className="tableCell">
              {t("table.status")}
            </TableCell>
            <TableCell className="tableCell">
              {t("table.paymentMethod")}
            </TableCell>
            <TableCell className="tableCell">
              {t("table.totalPaid")}
            </TableCell>
            <TableCell className="tableCell">
              {t("table.employeeId")}
            </TableCell>
            <TableCell className="tableCell">
              {t("table.note")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.data.map((row) => (
            <TableRow key={row._id}>
              <TableCell className="tableCell">
                {row._id}
              </TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  {row.bookingId}
                </div>
              </TableCell>
              <TableCell className="tableCell">
                {row.status}{" "}
                {row.status === "done" ? (
                  <CircleIcon
                    className="statusIcon"
                    style={{
                      color: "Green",
                      fontSize: "small",
                    }}
                  />
                ) : (
                  <CircleIcon
                    className="statusIcon"
                    style={{
                      color: "Red",
                      fontSize: "small",
                    }}
                  />
                )}
              </TableCell>
              <TableCell className="tableCell">
                {row.paymentMethod}
              </TableCell>
              <TableCell className="tableCell">
                {row.totalPaid}
              </TableCell>
              <TableCell className="tableCell">
                {row.employeeId}
              </TableCell>
              <TableCell className="tableCell">
                <span className={`status ${row.status}`}>
                  {row.note}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
