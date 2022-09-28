import express from "express";
import {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrder,
  getOrders,
  getOrdersByBooking,
  getOrdersPaidThisMonth,
  getIncomeThisMonth,
  getOrdersPaidLastMonth,
  getIncomeLastMonth,
  getOrdersLatest,
  getIncomeOrderByUserId,
  getIncomeByServiceThisYear,
  getIncomeByFoodThisYear,
  getIncomeByDrinkThisYear,
  getIncomeByServiceLastYear,
  getIncomeByFoodLastYear,
  getIncomeByDrinkLastYear,
  getIncomeByServiceLastMonth,
  getIncomeByServiceLastWeek,
  getIncomeByServiceYesterday,
  getOrdersByAllBookingInHotel,
} from "../controllers/OrderController.js";
import {
  verifyAdmin,
  verifyUser,
} from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyUser, createOrder);
//UPDATE
router.put("/:id", verifyAdmin, updateOrder);
//DELETE
router.delete("/:id", verifyAdmin, deleteOrder);
//GET
router.get("/:id", verifyUser, getOrder);
//GETALL
router.get("/", verifyAdmin, getOrders);
//GETALL BY BOOKING
router.get("/booking/:id", verifyUser, getOrdersByBooking);
//GET ALL ORDERS BY ALL BOOKINGS IN THE EMPLOYEE'S HOTEL
router.get(
  "/hotel/room/:id",
  verifyUser,
  getOrdersByAllBookingInHotel
);
//GETORDERSPAIDTHISMONTH
router.get(
  "/paid/now",
  verifyAdmin,
  getOrdersPaidThisMonth
);
//GETINCOMETHISMONTH
router.get("/income/now", verifyAdmin, getIncomeThisMonth);
//GETORDERSPAIDLASTMONTH
router.get(
  "/paid/last",
  verifyAdmin,
  getOrdersPaidLastMonth
);
//GETINCOMELASTMONTH
router.get("/income/last", verifyAdmin, getIncomeLastMonth);
//GETLASTESTORDERS
router.get("/sort/newest/:id", verifyAdmin, getOrdersLatest);
//GETTOTALPAIDTODAYBYUSERID
router.get(
  "/user/income/today/:id",
  verifyAdmin,
  getIncomeOrderByUserId
);
//GETINFOORDERSERVICETHISYEAR
router.get(
  "/hotel/income/service/year/:id",
  verifyAdmin,
  getIncomeByServiceThisYear
);
//GETINFOORDERFOODTHISYEAR
router.get(
  "/hotel/income/food/year/:id",
  verifyAdmin,
  getIncomeByFoodThisYear
);
//GETINFOORDERDRINKTHISYEAR
router.get(
  "/hotel/income/drink/year/:id",
  verifyAdmin,
  getIncomeByDrinkThisYear
);
//GETINFOORDERSERVICELASTYEAR
router.get(
  "/hotel/income/service/lastyear/:id",
  verifyAdmin,
  getIncomeByServiceLastYear
);
//GETINFOORDERFOODLASTYEAR
router.get(
  "/hotel/income/food/lastyear/:id",
  verifyAdmin,
  getIncomeByFoodLastYear
);
//GETINFOORDERDRINKLASTYEAR
router.get(
  "/hotel/income/drink/lastyear/:id",
  verifyAdmin,
  getIncomeByDrinkLastYear
);
//GETINFOORDERLASTMONTH
router.get(
  "/hotel/income/service/lastmonth/:id",
  verifyAdmin,
  getIncomeByServiceLastMonth
);
//GETINFOORDERLASTWEEK
router.get(
  "/hotel/income/service/lastweek/:id",
  verifyAdmin,
  getIncomeByServiceLastWeek
);
//GETINFOORDERYESERDAY
router.get(
  "/hotel/income/service/yesterday/:id",
  verifyAdmin,
  getIncomeByServiceYesterday
);
export default router;
