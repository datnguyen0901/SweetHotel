import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
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
  { timestamps: true }
);

export default mongoose.model("Service", ServiceSchema);
