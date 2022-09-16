import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // waiting or done
    status: {
      type: String,
      required: true,
    },
    // cash or online
    paymentMethod: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    serviceOrders: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
      { timestamps: true },
    ],
    totalPaid: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
