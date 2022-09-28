import express from "express";
import {
  createFinalization,
  updateFinalization,
  deleteFinalization,
  getFinalization,
  getFinalizations,
  getFinalizationsPaidThisMonth,
  getIncomeThisMonth,
  getFinalizationsPaidLastMonth,
  getIncomeLastMonth,
  getFinalizationsPaidThisYear,
  getFinalizationByUserId,
  getFinalizationsPaidThisYearByUserId,
  getUnpaidByUserIdToday,
  getFinalizationsByAllBookingInHotel,
} from "../controllers/finalizationController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createFinalization);
//UPDATE
router.put("/:id", verifyAdmin, updateFinalization);
//DELETE
router.delete("/:id", verifyAdmin, deleteFinalization);
//GET
router.get("/:id", verifyAdmin, getFinalization);
//GETALL
router.get("/", verifyAdmin, getFinalizations);
//GET ALL FINALIZATIONS BY ALL BOOKINGS IN THE EMPLOYEE'S HOTEL
router.get(
  "/hotel/room/:id",
  verifyUser,
  getFinalizationsByAllBookingInHotel
);
//GETFinalizationSPAIDTHISMONTH
router.get(
  "/paid/now",
  verifyAdmin,
  getFinalizationsPaidThisMonth
);
//GETINCOMETHISMONTH
router.get("/income/now", verifyAdmin, getIncomeThisMonth);
//GETFinalizationSPAIDLASTMONTH
router.get(
  "/paid/last",
  verifyAdmin,
  getFinalizationsPaidLastMonth
);
//GETINCOMELASTMONTH
router.get("/income/last", verifyAdmin, getIncomeLastMonth);
//GETINCOMEEACHMONTHINTHISYEAR
router.get(
  "/income/each",
  verifyAdmin,
  getFinalizationsPaidThisYear
);
//GETFINALIZATIONBYUSERID
router.get(
  "/user/:id",
  verifyAdmin,
  getFinalizationByUserId
);
//GETFINALIZATIONBYUSERIDINTHISYEAR
router.get(
  "/user/each/:id",
  verifyAdmin,
  getFinalizationsPaidThisYearByUserId
);
//GETTOTALPAIDTODAYBYUSERID
router.get(
  "/user/income/today/:id",
  verifyAdmin,
  getUnpaidByUserIdToday
);

export default router;
