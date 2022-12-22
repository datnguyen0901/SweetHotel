import express from "express";
import {
  createService,
  updateService,
  deleteService,
  getService,
  getServices,
  addMoreServiceStorage,
  updateServiceStorage,
  deleteServiceStorage,
  getServiceStorage,
  getServiceStorageValid,
  getInfoServiceStorage,
} from "../controllers/ServiceController.js";
import {
  verifyAdmin,
  verifyRole,
  verifyToken,
} from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyAdmin, verifyRole, createService);
//ADD MORE SERVICES INTO HOTEL STORAGE
router.put(
  "/hotel/:id",
  verifyToken,
  verifyRole,
  addMoreServiceStorage
);
//GET ALL SERVICES BY HOTELID TO CHECK VALID
router.get(
  "/hotel/valid/:id",
  verifyToken,
  getServiceStorageValid
);
//GET ALL SERVICES BY HOTELID
router.get("/hotel/:id", verifyToken, getServiceStorage);
//GET INFO OF DEDICATED SERVICE BY ID
router.get(
  "/hotel/edit/:id",
  verifyAdmin,
  verifyRole,
  getInfoServiceStorage
);
//MODIFY SERVICE IN STORAGE
router.put(
  "/hotel/storage/:id",
  verifyToken,
  updateServiceStorage
);
// DELETE SERVICE IN STORAGE
router.delete(
  "/hotel/storage/:id",
  verifyToken,
  deleteServiceStorage
);
//UPDATE
router.put("/:id", verifyAdmin, updateService);
//DELETE
router.delete(
  "/:id",
  verifyAdmin,
  verifyRole,
  deleteService
);
//GET
router.get("/:id", verifyAdmin, getService);
//GETALL
router.get("/", verifyAdmin, getServices);

export default router;
