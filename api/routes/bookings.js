import express from "express";
import {
  createBooking,
  updateBooking,
  deleteBooking,
  getBooking,
  getBookings,
  getBookingsByRoomId,
  getBookingsPaidThisMonth,
  getBookingsPaidLastMonth,
  getIncomeThisMonth,
  getIncomeLastMonth,
  getBookingByUserId,
  getIncomeBookingByUserId,
} from "../controllers/BookingController.js";
import { getRoomNumbers } from "../controllers/roomController.js";
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
router.delete("/:id", verifyAdmin, deleteBooking);
//GET
router.get("/:id", verifyUser, getBooking);
//GETALL
router.get("/", verifyAdmin, getBookings);
//GETALLBYROOMID
router.get("/room/:id", verifyUser, getBookingsByRoomId);
//GETBOOKINGSPAIDTHISMONTH
router.get(
  "/paid/now",
  verifyUser,
  getBookingsPaidThisMonth
);
//GETINCOMETHISMONTH
router.get("/income/now", verifyUser, getIncomeThisMonth);
//GETBOOKINGSPAIDLASTMONTH
router.get(
  "/paid/last",
  verifyUser,
  getBookingsPaidLastMonth
);
//GETINCOMELASTMONTH
router.get("/income/last", verifyUser, getIncomeLastMonth);
//GETBOOKINGBYUSERID
router.get("/user/:id", verifyUser, getBookingByUserId);
//GETTOTALPAIDTODAYBYUSERID
router.get("/user/income/today/:id", verifyUser, getIncomeBookingByUserId);

export default router;
