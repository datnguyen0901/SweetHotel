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

const List = () => {
  // get data from order sort newest
  const rows = useFetch(`/orders/sort/newest`);
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
              Status
            </TableCell>
            <TableCell className="tableCell">
              Payment Method
            </TableCell>
            <TableCell className="tableCell">
              Total Price
            </TableCell>
            <TableCell className="tableCell">
              Employee ID
            </TableCell>
            <TableCell className="tableCell">
              Note
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
                {row.totalPrice}
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
