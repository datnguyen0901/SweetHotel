import express from "express";
import User from "../models/User.js";
import { updateUser, deleteUser, getUser, getUsers } from "../controllers/UserController.js";
import { createError } from "../utils/error.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

//UPDATE
router.put("/:id", verifyUser, updateUser);
//DELETE
router.delete("/:id", verifyUser, deleteUser);
//GET
router.get("/:id", verifyUser, getUser);
//GETALL
router.get("/", verifyAdmin, getUsers);



export default router;