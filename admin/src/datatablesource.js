export const userColumns = [
  { field: "_id", headerName: "ID", width: 120 },
  {
    field: "user",
    headerName: "User",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={
              params.row.img ||
              "https://i.ibb.co/MBtjqXQ/no-avatar.gif"
            }
            alt="avatar"
          />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "fullName",
    headerName: "Full Name",
    width: 150,
  },
  { field: "gender", headerName: " Gender", width: 65 },
  { field: "address", headerName: "Address", width: 200 },
  { field: "cid", headerName: "CID", width: 125 },
  {
    field: "email",
    headerName: "Email",
    width: 150,
  },

  {
    field: "country",
    headerName: "Country",
    width: 100,
  },
  {
    field: "city",
    headerName: "City",
    width: 100,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 125,
  },
];

export const hotelColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "type",
    headerName: "Type",
    width: 100,
  },
  {
    field: "title",
    headerName: "Title",
    width: 230,
  },
  {
    field: "city",
    headerName: "City",
    width: 100,
  },
];

export const roomColumns = [
  { field: "_id", headerName: "ID", width: 230 },
  {
    field: "title",
    headerName: "Title",
    width: 230,
  },
  {
    field: "desc",
    headerName: "Description",
    width: 200,
  },
  {
    field: "price",
    headerName: "Price",
    width: 100,
  },
  {
    field: "maxPeople",
    headerName: "Max People",
    width: 100,
  },
];

export const roleColumns = [
  { field: "_id", headerName: "ID", width: 230 },
  {
    field: "name",
    headerName: "Name",
    width: 230,
  },
  {
    field: "type",
    headerName: "Type",
    width: 200,
  },
];

export const bookingColumns = [
  { field: "_id", headerName: "ID", width: 230 },
  {
    field: "roomNumber",
    headerName: "Room Number",
    width: 110,
  },
  {
    field: "checkinDate",
    headerName: "Check In Date",
    width: 150,
  },
  {
    field: "checkoutDate",
    headerName: "Check Out Date",
    width: 150,
  },
  {
    field: "type",
    headerName: "Type",
    width: 100,
  },
  {
    field: "status",
    headerName: "Status",
    width: 180,
  },
  {
    field: "paymentMethod",
    headerName: "Payment Method",
    width: 180,
  },
  {
    field: "note",
    headerName: "Note",
    width: 180,
  },
];

export const roomNumbersColumns = [
  { field: "_id", headerName: "ID", width: 230 },
  {
    field: "number",
    headerName: "Number",
    width: 130,
  },
  {
    field: "unavailableDates",
    headerName: "UnavailableDates",
    width: 220,
  },
];

export const serviceColumns = [
  { field: "_id", headerName: "ID", width: 230 },
  {
    field: "service",
    headerName: "Service",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={
              params.row.img ||
              "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
            }
            alt="avatar"
          />
          {params.row.name}
        </div>
      );
    },
  },
  {
    field: "desc",
    headerName: "Description",
    width: 200,
  },
  {
    field: "price",
    headerName: "Price",
    width: 130,
  },
  {
    field: "type",
    headerName: "Type",
    width: 130,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    width: 70,
  },
];

export const orderColumns = [
  { field: "_id", headerName: "ID", width: 230 },
  {
    field: "bookingId",
    headerName: "Booking ID",
    width: 230,
  },
  {
    field: "status",
    headerName: "Status",
    width: 70,
  },
  {
    field: "paymentMethod",
    headerName: "Payment Method",
    width: 150,
  },
  {
    field: "note",
    headerName: "Note",
    width: 150,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 120,
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    width: 120,
  },
];

export const finalizationColumns = [
  { field: "_id", headerName: "ID", width: 150 },
  {
    field: "bookingId",
    headerName: "Booking ID",
    width: 210,
  },
  {
    field: "paid",
    headerName: "Paid",
    width: 60,
  },
  {
    field: "unpaid",
    headerName: "Unpaid",
    width: 60,
  },
  {
    field: "paymentMethod",
    headerName: "Payment Method",
    width: 125,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 150,
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    width: 150,
  },
  {
    field: "note",
    headerName: "Note",
    width: 250,
  },
];

export const roomAttendantColumns = [
  { field: "_id", headerName: "ID", width: 230 },
  {
    field: "roomNumber",
    headerName: "Room Number",
    width: 120,
  },
  {
    field: "price",
    headerName: "Price",
    width: 100,
  },
  {
    field: "maxPeople",
    headerName: "Max People",
    width: 100,
  },
  {
    field: "nextUnavailableDate",
    headerName: "Next Unavailable Date",
    width: 230,
  },
  {
    field: "title",
    headerName: "Title",
    width: 150,
  },
];
