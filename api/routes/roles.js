import express from "express";
import {
  createRole,
  updateRole,
  deleteRole,
  getRole,
  getRoles,
} from "../controllers/roleController.js";
import {
  verifyAdmin,
  verifyRole,
  verifyUser,
} from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyAdmin, verifyRole, createRole);
//UPDATE
router.put("/:id", verifyAdmin, verifyRole, updateRole);
//DELETE
router.delete("/:id", verifyAdmin, verifyRole, deleteRole);
//GET
router.get("/:id", verifyAdmin, getRole);
//GETALL
router.get("/", verifyAdmin, getRoles);

export default router;
