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
} from "../controllers/finalizationController.js";
import {
  verifyAdmin,
  verifyUser,
} from "../utils/verifyToken.js";

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
//GETFinalizationSPAIDTHISMONTH
router.get(
  "/paid/now",
  verifyUser,
  getFinalizationsPaidThisMonth
);
//GETINCOMETHISMONTH
router.get("/income/now", verifyUser, getIncomeThisMonth);
//GETFinalizationSPAIDLASTMONTH
router.get(
  "/paid/last",
  verifyUser,
  getFinalizationsPaidLastMonth
);
//GETINCOMELASTMONTH
router.get("/income/last", verifyUser, getIncomeLastMonth);
//GETINCOMEEACHMONTHINTHISYEAR
router.get(
  "/income/each",
  verifyUser,
  getFinalizationsPaidThisYear
);
//GETFINALIZATIONBYUSERID
router.get(
  "/user/:id",
  verifyUser,
  getFinalizationByUserId
);
//GETFINALIZATIONBYUSERIDINTHISYEAR
router.get(
  "/user/each/:id",
  verifyUser,
  getFinalizationsPaidThisYearByUserId
);
//GETTOTALPAIDTODAYBYUSERID
router.get(
  "/user/income/today/:id",
  verifyUser,
  getUnpaidByUserIdToday
);

export default router;
