import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  getUserByRoleId,
  activeUser,
  getHotelEmployee,
  sendMailResetPassword,
  changePassword,
  updatePassword,
  getManagerByHotelId,
} from "../controllers/UserController.js";
import {
  verifyUser,
  verifyAdmin,
  verifyToken,
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
//GETALLUSERSFORHOTELEMPLOYEE
router.get(
  "/hotel/employee/:id",
  verifyAdmin,
  getHotelEmployee
);
//GETALLUSERSBYROLEID
router.get("/employee/:id", verifyAdmin, getUserByRoleId);
//ACTIVEUSER
router.get("/confirm/:id", activeUser);
//SENDMAILTORESETPASSWORD
router.post("/resetpassword/email", sendMailResetPassword);
//RESETPASSWORD
router.get("/resetpassword/id/:id", changePassword);
//UPDATEPASSWORD
router.put("/updatepassword/:id", updatePassword);
//GETMANAGERHOTELINFO
router.get("/manager/:id", verifyUser, getManagerByHotelId);

export default router;
