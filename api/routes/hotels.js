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
} from "../controllers/hotelController.js";
import { createError } from "../utils/error.js";
import {
  verifyToken,
  verifyAdmin,
} from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createHotel);
//UPDATE
router.put("/:id", verifyAdmin, updateHotel);
//DELETE
router.delete("/:id", verifyAdmin, deleteHotel);
//GET
router.get("/find/:id", getHotel);
//GETALL
router.get("/", getHotels);

router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);

//GETALLHOTELCITY
router.get("/getname/city", getHotelCities);

//GETHOTELIDBYROOMID
router.get("/gethotelid/:id", getHotelIdByRoomId);

export default router;
