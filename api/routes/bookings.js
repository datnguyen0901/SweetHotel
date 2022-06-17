import express from "express";
import {
  createBooking,
  updateBooking,
  deleteBooking,
  getBooking,
  getBookings,
} from "../controllers/BookingController.js";
import {
  verifyAdmin,
  verifyUser,
} from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyUser, createBooking);
//UPDATE
router.put("/:id", verifyUser, updateBooking);
//DELETE
router.delete("/:id", verifyUser, deleteBooking);
//GET
router.get("/:id", verifyUser, getBooking);
//GETALL
router.get("/", verifyAdmin, getBookings);

export default router;
