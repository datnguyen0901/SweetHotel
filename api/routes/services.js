import express from "express";
import {
  createService,
  updateService,
  deleteService,
  getService,
  getServices,
} from "../controllers/ServiceController.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createService);
//UPDATE
router.put("/:id", verifyAdmin, updateService);
//DELETE
router.delete("/:id", verifyAdmin, deleteService);
//GET
router.get("/:id", verifyAdmin, getService);
//GETALL
router.get("/", verifyAdmin, getServices);

export default router;
