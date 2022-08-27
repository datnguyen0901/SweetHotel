import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useFetch from "../../hooks/useFetch";

const ListIndividualUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const rows = useFetch(`/finalizations/user/${user._id}`);
  return (
    <TableContainer component={Paper} className="table">
      <Table
        sx={{ minWidth: 650 }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">
              Tracking ID
            </TableCell>
            <TableCell className="tableCell">
              Booking ID
            </TableCell>
            <TableCell className="tableCell">
              Paid
            </TableCell>
            <TableCell className="tableCell">
              Unpaid
            </TableCell>
            <TableCell className="tableCell">
              Payment Method
            </TableCell>
            <TableCell className="tableCell">
              Total Price
            </TableCell>
            <TableCell className="tableCell">
              Create At
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
                {row.paid}
              </TableCell>
              <TableCell className="tableCell">
                <span className="tableCell">
                  {row.unpaid}
                </span>
              </TableCell>
              <TableCell className="tableCell">
                {row.paymentMethod}
              </TableCell>
              <TableCell className="tableCell">
                {row.paid + row.unpaid}
              </TableCell>
              <TableCell className="tableCell">
                {row.createdAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListIndividualUser;
