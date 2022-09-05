export const userColumnsVN = [
  { field: "_id", headerName: "ID", width: 120 },
  {
    field: "user",
    headerName: "Người dùng",
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
    headerName: "Họ tên",
    width: 150,
  },
  { field: "gender", headerName: " Giới tính", width: 65 },
  { field: "address", headerName: "Địa chỉ", width: 200 },
  { field: "cid", headerName: "CCCD", width: 125 },
  {
    field: "email",
    headerName: "Thư điện tử",
    width: 150,
  },

  {
    field: "country",
    headerName: "Quốc gia",
    width: 100,
  },
  {
    field: "city",
    headerName: "Thành Phố",
    width: 100,
  },
  {
    field: "phone",
    headerName: "Điện thoại",
    width: 125,
  },
];

export const hotelColumnsVN = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "name",
    headerName: "Tên",
    width: 150,
  },
  {
    field: "type",
    headerName: "Loại",
    width: 100,
  },
  {
    field: "title",
    headerName: "Tiêu đề",
    width: 230,
  },
  {
    field: "city",
    headerName: "Thành phố",
    width: 100,
  },
];

export const roomColumnsVN = [
  { field: "_id", headerName: "ID", width: 230 },
  {
    field: "title",
    headerName: "Tiêu đề",
    width: 230,
  },
  {
    field: "desc",
    headerName: "Mô tả",
    width: 200,
  },
  {
    field: "price",
    headerName: "Giá",
    width: 100,
  },
  {
    field: "maxPeople",
    headerName: "Số người tối đa",
    width: 100,
  },
];

export const roleColumnsVN = [
  { field: "_id", headerName: "ID", width: 230 },
  {
    field: "name",
    headerName: "Tên",
    width: 230,
  },
  {
    field: "type",
    headerName: "Loại",
    width: 200,
  },
];

export const bookingColumnsVN = [
  { field: "_id", headerName: "ID", width: 230 },
  {
    field: "roomNumber",
    headerName: "Số phòng",
    width: 110,
  },
  {
    field: "checkinDate",
    headerName: "Ngày đến",
    width: 150,
  },
  {
    field: "checkoutDate",
    headerName: "Ngày đi",
    width: 150,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 180,
  },
  {
    field: "paymentMethod",
    headerName: "Phương thức thanh toán",
    width: 180,
  },
  {
    field: "note",
    headerName: "Ghi chú",
    width: 180,
  },
];

export const roomNumbersColumnsVN = [
  { field: "_id", headerName: "ID", width: 230 },
  {
    field: "number",
    headerName: "Số phòng",
    width: 130,
  },
  {
    field: "unavailableDates",
    headerName: "Ngày không thể đặt",
    width: 220,
  },
];

export const serviceColumnsVN = [
  { field: "_id", headerName: "ID", width: 230 },
  {
    field: "service",
    headerName: "Dịch vụ",
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
    headerName: "Mô tả",
    width: 200,
  },
  {
    field: "price",
    headerName: "Giá",
    width: 130,
  },
  {
    field: "type",
    headerName: "Loại",
    width: 130,
  },

  {
    field: "quantity",
    headerName: "Số lượng",
    width: 70,
  },
];

export const orderColumnsVN = [
  { field: "_id", headerName: "ID", width: 230 },
  {
    field: "bookingId",
    headerName: "ID đặt phòng",
    width: 230,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 70,
  },
  {
    field: "paymentMethod",
    headerName: "Phương thức thanh toán",
    width: 150,
  },
  {
    field: "note",
    headerName: "Ghi chú",
    width: 150,
  },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    width: 120,
  },
  {
    field: "updatedAt",
    headerName: "Ngày cập nhật",
    width: 120,
  },
];

export const finalizationColumnsVN = [
  { field: "_id", headerName: "ID", width: 150 },
  {
    field: "bookingId",
    headerName: "ID đặt phòng",
    width: 210,
  },
  {
    field: "paid",
    headerName: "Đã thanh toán",
    width: 60,
  },
  {
    field: "unpaid",
    headerName: "Chưa thanh toán",
    width: 60,
  },
  {
    field: "paymentMethod",
    headerName: "Phương thức thanh toán",
    width: 125,
  },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    width: 150,
  },
  {
    field: "updatedAt",
    headerName: "Ngày cập nhật",
    width: 150,
  },
  {
    field: "note",
    headerName: "Ghi chú",
    width: 250,
  },
];
