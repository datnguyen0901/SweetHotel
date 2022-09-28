import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    storage: [
      {
        name: {
          type: String,
          required: true,
        },
        desc: {
          type: String,
        },
        price: {
          type: Number,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        img: {
          type: String,
        },
        quantity: {
          type: Number,
        },
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Service", ServiceSchema);
