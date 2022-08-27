import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // This is for employee
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkinDate: {
      type: Date,
      required: true,
    },
    checkoutDate: {
      type: Date,
      required: true,
    },
    // open or closed or waiting
    status: {
      type: String,
      required: true,
    },
    // cash or online
    paymentMethod: {
      type: String,
      required: true,
    },
    totalPaid: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);