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

const ListRevenueAccountant = () => {
  const bookingData = useFetch(
    `/bookings//hotel/revenue/yesterday`
  ).data;
  const rows = Object.keys(bookingData).map(
    // convert key to int the + 1 set to _id
    (key) => ({ ...bookingData[key], _id: +key })
  );

  // get yesterday
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const yesterday = date.toISOString().slice(0, 10);

  const csvData = rows.map((row) => ({
    _id: row._id,
    Month: row.hotelId,
    BookingQty: row.name,
    TotalIncome: row.totalPaid,
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
              {t("id")}
            </TableCell>
            <TableCell className="tableCell">
              {t("name")}
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
                  {row.hotelId}
                </div>
              </TableCell>
              <TableCell className="tableCell">
                {row.name}
              </TableCell>
              <TableCell className="tableCell">
                {row.totalPaid}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <button className="btn btn-primary">
        <CSVLink
          filename={"HotelRevenue " + yesterday + ".csv"}
          data={csvData}
        >
          {t("download")}
        </CSVLink>
      </button>
    </TableContainer>
  );
};

export default ListRevenueAccountant;
