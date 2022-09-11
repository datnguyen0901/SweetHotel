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
  getIncomeByService,
} from "../controllers/OrderController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyUser, createOrder);
//UPDATE
router.put("/:id", verifyAdmin, updateOrder);
//DELETE
router.delete("/:id", verifyAdmin, deleteOrder);
//GET
router.get("/:id", verifyAdmin, getOrder);
//GETALL
router.get("/", verifyAdmin, getOrders);
//GETALL BY BOOKING
router.get("/booking/:id", verifyAdmin, getOrdersByBooking);
//GETORDERSPAIDTHISMONTH
router.get("/paid/now", verifyAdmin, getOrdersPaidThisMonth);
//GETINCOMETHISMONTH
router.get("/income/now", verifyAdmin, getIncomeThisMonth);
//GETORDERSPAIDLASTMONTH
router.get(
  "/paid/last",
  verifyUser,
  getOrdersPaidLastMonth
);
//GETINCOMELASTMONTH
router.get("/income/last", verifyAdmin, getIncomeLastMonth);
//GETLASTESTORDERS
router.get("/sort/newest", verifyAdmin, getOrdersLatest);
//GETTOTALPAIDTODAYBYUSERID
router.get("/user/income/today/:id", verifyUser, getIncomeOrderByUserId);
//GETINFOORDERTHISYEAR
router.get("/hotel/income/year/:id", verifyAdmin, getIncomeByService);

export default router;
