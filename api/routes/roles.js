import express from "express";
import {
  createRole,
  updateRole,
  deleteRole,
  getRole,
  getRoles,
} from "../controllers/roleController.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createRole);
//UPDATE
router.put("/:id", verifyAdmin, updateRole);
//DELETE
router.delete("/:id", verifyAdmin, deleteRole);
//GET
router.get("/:id", verifyAdmin, getRole);
//GETALL
router.get("/", verifyAdmin, getRoles);

export default router;
