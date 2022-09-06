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
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/:hotelid", verifyAdmin, createRoom);
//UPDATE
router.put("/:id", verifyAdmin, updateRoom);
router.put("/availability/:id", updateRoomAvailability);
//DELETE available rooms
router.delete(
  "/availability/delete/:id",
  verifyAdmin,
  deleteRoomAvailability
);
//DELETE rooms by roomNumber
router.delete(
  "/roomNumbers/:id/:roomId",
  verifyAdmin,
  deleteRoomNumbers
);
//DELETE Base on Hotel ID
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);
//DELETE
router.delete("/:id/", verifyAdmin, deleteRooms);
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
