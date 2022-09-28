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
  getBookingsByUser,
  replaceBookingsByRoomId,
  getBookingIfCheckinDateIsPassed,
  getBookingsByHotelId,
} from "../controllers/BookingController.js";
import {
  verifyAdmin,
  verifyRole,
  verifyUser,
} from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyUser, createBooking);
//UPDATE
router.put("/:id", verifyUser, updateBooking);
//DELETE
router.delete(
  "/:id",
  verifyAdmin,
  verifyRole,
  deleteBooking
);
//DELETEBOOKINGIFCHECKINDATEISPASSED
router.get(
  "/deletebooking/checkindate",
  verifyAdmin,
  getBookingIfCheckinDateIsPassed
);
//GET
router.get("/:id", verifyUser, getBooking);
//GETALL
router.get("/", verifyAdmin, getBookings);
//GETALLBYROOMID
router.get("/room/:id", verifyUser, getBookingsByRoomId);
//REPLACEALLBYROOMID
router.get(
  "/replace/:id",
  verifyAdmin,
  verifyRole,
  replaceBookingsByRoomId
);
//GETBOOKINGBYUSERID
router.get("/user/:id", verifyUser, getBookingsByUser);
//GETBOOKINGSPAIDTHISMONTH
router.get(
  "/paid/now",
  verifyAdmin,
  getBookingsPaidThisMonth
);
//GETINCOMETHISMONTH
router.get("/income/now", verifyAdmin, getIncomeThisMonth);
//GETBOOKINGSPAIDLASTMONTH
router.get(
  "/paid/last",
  verifyAdmin,
  getBookingsPaidLastMonth
);
//GETINCOMELASTMONTH
router.get("/income/last", verifyAdmin, getIncomeLastMonth);
//GETBOOKINGBYUSERID
router.get("/user/:id", verifyAdmin, getBookingByUserId);
//GETTOTALPAIDTODAYBYUSERID
router.get(
  "/user/income/today/:id",
  verifyAdmin,
  getIncomeBookingByUserId
);
//GETTOTALPAIDLASTYEARBYUSERHOTELBYDAYANDHOUR
router.get(
  "/hotel/income/lastyear/:id",
  verifyAdmin,
  getIncomeBookingByEmployeeIdLast
);
//GETTOTALPAIDTHISYEARBYUSERHOTELBYDAYANDHOUR
router.get(
  "/hotel/income/year/:id",
  verifyAdmin,
  getIncomeBookingByEmployeeId
);
//GETTOTALPAIDLASTMONTHBYUSERHOTELBYDAYANDHOUR
router.get(
  "/hotel/income/month/:id",
  verifyAdmin,
  getIncomeBookingByEmployeeIdThisMonth
);
//GETTOTALPAIDLASTWEEKBYUSERHOTELBYDAYANDHOUR
router.get(
  "/hotel/income/week/:id",
  verifyAdmin,
  getIncomeBookingByEmployeeIdThisWeek
);
//GETTOTALPAIDYESTERDAYBYUSERHOTELBYDAYANDHOUR
router.get(
  "/hotel/income/yesterday/:id",
  verifyAdmin,
  getIncomeBookingByEmployeeIdYesterday
);
//GETTOTALPAIDYESTERDAY
router.get(
  "/hotel/income/yesterdaycheck/:id",
  verifyAdmin,
  getBookingByEmployeeIdYesterday
);
//GETINFOTHISYEARBYUSERHOTELINBOOKINGANDORDER
router.get(
  "/hotel/info/year/:id",
  verifyAdmin,
  getIncomeBookingAndOrderByEmployeeIdThisYear
);
//GETINFOLASTYEARBYUSERHOTELINBOOKINGANDORDER
router.get(
  "/hotel/info/lastyear/:id",
  verifyAdmin,
  getIncomeBookingAndOrderByEmployeeIdLastYear
);
//GETINFOLASTMONTHBYUSERHOTELINBOOKINGANDORDER
router.get(
  "/hotel/info/lastmonth/:id",
  verifyAdmin,
  getIncomeBookingAndOrderByEmployeeIdLastMonth
);
//GETINFOLASTWEEKBYUSERHOTELINBOOKINGANDORDER
router.get(
  "/hotel/info/lastweek/:id",
  verifyAdmin,
  getIncomeBookingAndOrderByEmployeeIdLastWeek
);
//GETINFOYESTERDAYBYUSERHOTELINBOOKINGANDORDER
router.get(
  "/hotel/info/yesterday/:id",
  verifyAdmin,
  getIncomeBookingAndOrderByEmployeeIdYesterday
);
//GETINFOTODAYBYUSERHOTELINBOOKINGANDORDER
router.get(
  "/hotel/info/today/:id",
  verifyAdmin,
  getIncomeBookingAndOrderByEmployeeIdToday
);
//GETALLBOOKINGBYROOMIDINROOMNUMBERBYTHEEMPLOYEEHOTEL
router.get(
  "/hotel/room/:id",
  verifyAdmin,
  getBookingsByHotelId
);
export default router;
