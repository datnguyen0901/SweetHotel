import express from "express";
import {
  createRoom,
  updateRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoomAvailability,
  deleteRooms,
  deleteRoomAvailability,
  getRoomNumbers,
  deleteRoomNumbers,
  getRoomNumber,
  getAvailableRoomsToday,
} from "../controllers/roomController.js";
import { verifyAdmin, verifyRole } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/:hotelid", verifyAdmin,verifyRole, createRoom);
//UPDATE
router.put("/:id", verifyAdmin,verifyRole, updateRoom);
router.put("/availability/:id", updateRoomAvailability);
//DELETE available rooms
router.delete(
  "/availability/delete/:id",
  verifyAdmin,verifyRole,
  deleteRoomAvailability
);
//DELETE rooms by roomNumber
router.delete(
  "/roomNumbers/:id/:roomId",
  verifyAdmin,verifyRole,
  deleteRoomNumbers
);
//DELETE Base on Hotel ID
router.delete("/:id/:hotelid", verifyAdmin,verifyRole, deleteRoom);
//DELETE
router.delete("/:id/", verifyAdmin,verifyRole, deleteRooms);
//GET
router.get("/:id", getRoom);
//GETALL
router.get("/", getRooms);
//GET RoomNumbers
router.get("/calendar/:id", getRoomNumbers);
//GET NUMBER IN ROOMNUMBERS BY ROOMNUMBERSID
router.get("/number/:id", getRoomNumber);
//GET ROOM AVAILABILITY TODAY
router.get(
  "/today/availability/:hotelid",
  getAvailableRoomsToday
);

export default router;
