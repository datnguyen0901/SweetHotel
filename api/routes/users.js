import express from "express";
import User from "../models/User.js";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  getUserByRoleId,
} from "../controllers/UserController.js";
import { createError } from "../utils/error.js";
import {
  verifyToken,
  verifyUser,
  verifyAdmin,
  verifyRole,
} from "../utils/verifyToken.js";

const router = express.Router();

//UPDATE
router.put("/:id", verifyUser, updateUser);
//DELETE
router.delete("/:id", verifyUser, deleteUser);
//GET
router.get("/:id", verifyUser, getUser);
//GETALL
router.get("/", verifyAdmin, getUsers);
//GETALLUSERSBYROLEID
router.get("/employee/:id", verifyAdmin, getUserByRoleId);

export default router;
