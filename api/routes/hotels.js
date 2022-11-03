import express from "express";
import Hotel from "../models/Hotel.js";
import {
  createHotel,
  updateHotel,
  deleteHotel,
  getHotel,
  getHotels,
  countByCity,
  countByType,
  getHotelRooms,
  getHotelCities,
  getHotelIdByRoomId,
  getHotelName,
} from "../controllers/hotelController.js";
import { createError } from "../utils/error.js";
import {
  verifyAdmin,
  verifyToken,
  verifyUser,
} from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createHotel);
//UPDATE
router.put("/:id", verifyAdmin, updateHotel);
//DELETE
router.delete("/:id", verifyAdmin, deleteHotel);
//GET
router.get("/find/:id", verifyToken, getHotel);
//GETALL
router.get("/", verifyToken, getHotels);

router.get("/countByCity", verifyToken, countByCity);
router.get("/countByType", verifyToken, countByType);
router.get("/room/:id", verifyToken, getHotelRooms);

//GETALLHOTELCITY
router.get("/getname/city", verifyToken, getHotelCities);

//GETHOTELIDBYROOMID
router.get(
  "/gethotelid/:id",
  verifyToken,
  getHotelIdByRoomId
);
// test get hotel name by roomNumber._id
router.get("/gethotelname/test/:id", verifyToken, getHotelName);

export default router;
