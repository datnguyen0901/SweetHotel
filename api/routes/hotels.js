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
  verifyAdmin,
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
router.get("/find/:id", verifyUser, getHotel);
//GETALL
router.get("/", verifyUser, getHotels);

router.get("/countByCity", verifyUser, countByCity);
router.get("/countByType", verifyUser, countByType);
router.get("/room/:id", verifyUser, getHotelRooms);

//GETALLHOTELCITY
router.get("/getname/city", verifyUser, getHotelCities);

//GETHOTELIDBYROOMID
router.get(
  "/gethotelid/:id",
  verifyUser,
  getHotelIdByRoomId
);

export default router;
