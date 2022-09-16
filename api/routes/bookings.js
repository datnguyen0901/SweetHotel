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
  getIncomeBookingByEmployeeId,
  getIncomeBookingByEmployeeIdThisMonth,
  getIncomeBookingByEmployeeIdLast,
  getIncomeBookingByEmployeeIdThisWeek,
  getIncomeBookingByEmployeeIdYesterday,
  getBookingByEmployeeIdYesterday,
  getIncomeBookingAndOrderByEmployeeIdThisYear,
  getIncomeBookingAndOrderByEmployeeIdLastYear,
  getIncomeBookingAndOrderByEmployeeIdLastMonth,
  getIncomeBookingAndOrderByEmployeeIdLastWeek,
  getIncomeBookingAndOrderByEmployeeIdYesterday,
  getIncomeBookingAndOrderByEmployeeIdToday,
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
router.get(
  "/user/income/today/:id",
  verifyUser,
  getIncomeBookingByUserId
);
//GETTOTALPAIDLASTYEARBYUSERHOTELBYDAYANDHOUR
router.get(
  "/hotel/income/lastyear/:id",
  verifyUser,
  getIncomeBookingByEmployeeIdLast
);
//GETTOTALPAIDTHISYEARBYUSERHOTELBYDAYANDHOUR
router.get(
  "/hotel/income/year/:id",
  verifyUser,
  getIncomeBookingByEmployeeId
);
//GETTOTALPAIDLASTMONTHBYUSERHOTELBYDAYANDHOUR
router.get(
  "/hotel/income/month/:id",
  verifyUser,
  getIncomeBookingByEmployeeIdThisMonth
);
//GETTOTALPAIDLASTWEEKBYUSERHOTELBYDAYANDHOUR
router.get(
  "/hotel/income/week/:id",
  verifyUser,
  getIncomeBookingByEmployeeIdThisWeek
);
//GETTOTALPAIDYESTERDAYBYUSERHOTELBYDAYANDHOUR
router.get(
  "/hotel/income/yesterday/:id",
  verifyUser,
  getIncomeBookingByEmployeeIdYesterday
);
//GETTOTALPAIDYESTERDAY
router.get(
  "/hotel/income/yesterdaycheck/:id",
  verifyUser,
  getBookingByEmployeeIdYesterday
);
//GETINFOTHISYEARBYUSERHOTELINBOOKINGANDORDER
router.get(
  "/hotel/info/year/:id",
  verifyUser,
  getIncomeBookingAndOrderByEmployeeIdThisYear
);
//GETINFOLASTYEARBYUSERHOTELINBOOKINGANDORDER
router.get(
  "/hotel/info/lastyear/:id",
  verifyUser,
  getIncomeBookingAndOrderByEmployeeIdLastYear
);
//GETINFOLASTMONTHBYUSERHOTELINBOOKINGANDORDER
router.get(
  "/hotel/info/lastmonth/:id",
  verifyUser,
  getIncomeBookingAndOrderByEmployeeIdLastMonth
);
//GETINFOLASTWEEKBYUSERHOTELINBOOKINGANDORDER
router.get(
  "/hotel/info/lastweek/:id",
  verifyUser,
  getIncomeBookingAndOrderByEmployeeIdLastWeek
);
//GETINFOYESTERDAYBYUSERHOTELINBOOKINGANDORDER
router.get(
  "/hotel/info/yesterday/:id",
  verifyUser,
  getIncomeBookingAndOrderByEmployeeIdYesterday
);
//GETINFOTODAYBYUSERHOTELINBOOKINGANDORDER
router.get(
  "/hotel/info/today/:id",
  verifyUser,
  getIncomeBookingAndOrderByEmployeeIdToday
);
export default router;
