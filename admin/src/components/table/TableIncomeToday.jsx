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

const ListIncomeToday = (userId) => {
  const id = userId.userId;
  const bookingData = useFetch(
    `/bookings/hotel/info/today/${id}`
  ).data;
  const rows = Object.keys(bookingData).map(
    // convert key to int the + 1 set to _id
    (key) => ({ ...bookingData[key], no: +key })
  );

  const csvData = rows.map((row) => ({
    No: row.no,
    ID: row._id,
    CreatedAt: row.createdAt,
    UpdatedAt: row.updatedAt,
    TotalPaid: row.totalPaid,
    Paid: row.paid,
    Unpaid: row.unpaid,
    PaymentMethod: row.paymentMethod,
    CheckingType: row.checkingType,
  }));
  const [t] = useTranslation("common");

  // for income of the logging user
  const incomeBooking = useFetch(
    `bookings/user/income/today/${id}`
  ).data;
  const incomeOder = useFetch(
    `orders/user/income/today/${id}`
  ).data;
  const incomeFinalization = useFetch(
    `finalizations/user/income/today/${id}`
  ).data;
  const totalIncomeToday =
    incomeBooking + incomeOder + incomeFinalization;
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
              {t("createdAt")}
            </TableCell>
            <TableCell className="tableCell">
              {t("updatedAt")}
            </TableCell>
            <TableCell className="tableCell">
              {t("totalPaid")}
            </TableCell>
            <TableCell className="tableCell">
              {t("paid")}
            </TableCell>
            <TableCell className="tableCell">
              {t("unpaid")}
            </TableCell>
            <TableCell className="tableCell">
              {t("paymentMethod")}
            </TableCell>
            <TableCell className="tableCell">
              {t("checkingType")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.no}>
              <TableCell className="tableCell">
                {row.no}
              </TableCell>
              <TableCell className="tableCell">
                {row._id}
              </TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  {row.createdAt}
                </div>
              </TableCell>
              <TableCell className="tableCell">
                {row.updatedAt}
              </TableCell>
              <TableCell className="tableCell">
                <span className="tableCell">
                  {row.totalPaid}
                </span>
              </TableCell>
              <TableCell className="tableCell">
                {row.paid}
              </TableCell>
              <TableCell className="tableCell">
                {row.unpaid}
              </TableCell>
              <TableCell className="tableCell">
                {row.paymentMethod}
              </TableCell>
              <TableCell className="tableCell">
                {row.checkingType}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <button className="btn btn-primary">
        <CSVLink
          filename={
            new Date().toLocaleDateString() +
            "IncomeThisToday" +
            id +
            ".csv"
          }
          data={csvData}
        >
          {t("download")}
        </CSVLink>
      </button>
      <div className="totalIncome">
        <h3>
          {t("totalIncomeToday")} :{" "}
          <span className="totalIncome">
            {totalIncomeToday} $
          </span>
        </h3>
      </div>
    </TableContainer>
  );
};

export default ListIncomeToday;
