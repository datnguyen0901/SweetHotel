import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useFetch from "../../hooks/useFetch";
import { useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";

const ListIncomeLastYear = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const bookingData = useFetch(
    `/bookings/hotel/info/lastyear/${user._id}`
  ).data;
  const rows = Object.keys(bookingData).map(
    // convert key to int the + 1 set to _id
    (key) => ({ ...bookingData[key], _id: +key + 1 })
  );

  const csvData = rows.map((row) => ({
    _id: row._id,
    Month: row.name,
    BookingQty: row.booking,
    TotalIncomeBooking: row.totalIncomeBooking,
    OrderQty: row.order,
    totalIncomeOrder: row.totalIncomeOrder,
    TotalIncome: row.total,
  }));
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
              {t("no")}
            </TableCell>
            <TableCell className="tableCell">
              {t("month")}
            </TableCell>
            <TableCell className="tableCell">
              {t("bookingQuantity")}
            </TableCell>
            <TableCell className="tableCell">
              {t("totalIncomeBooking")}
            </TableCell>
            <TableCell className="tableCell">
              {t("orderQuantity")}
            </TableCell>
            <TableCell className="tableCell">
              {t("totalIncomeOrder")}
            </TableCell>
            <TableCell className="tableCell">
              {t("totalIncome")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row._id}>
              <TableCell className="tableCell">
                {row._id}
              </TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  {row.name}
                </div>
              </TableCell>
              <TableCell className="tableCell">
                {row.booking}
              </TableCell>
              <TableCell className="tableCell">
                <span className="tableCell">
                  {row.totalIncomeBooking}
                </span>
              </TableCell>
              <TableCell className="tableCell">
                {row.order}
              </TableCell>
              <TableCell className="tableCell">
                {row.totalIncomeOrder}
              </TableCell>
              <TableCell className="tableCell">
                {row.total}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <button className="btn btn-primary">
        <CSVLink
          filename="IncomeThisLastYear"
          data={csvData}
        >
          {t("download")}
        </CSVLink>
      </button>
    </TableContainer>
  );
};

export default ListIncomeLastYear;
