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
} from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyAdmin, verifyRole, createService);
//ADD MORE SERVICES INTO HOTEL STORAGE
router.put(
  "/hotel/:id",
  verifyAdmin,
  verifyRole,
  addMoreServiceStorage
);
//GET ALL SERVICES BY HOTELID TO CHECK VALID
router.get(
  "/hotel/valid/:id",
  verifyAdmin,
  verifyRole,
  getServiceStorageValid
);
//GET ALL SERVICES BY HOTELID
router.get(
  "/hotel/:id",
  verifyAdmin,
  verifyRole,
  getServiceStorage
);
//GET INFO OF DEDICATED SERVICE BY ID
router.get("/hotel/edit/:id", verifyAdmin, verifyRole, getInfoServiceStorage);
//MODIFY SERVICE IN STORAGE
router.put(
  "/hotel/storage/:id",
  verifyAdmin,
  verifyRole,
  updateServiceStorage
);
// DELETE SERVICE IN STORAGE
router.delete(
  "/hotel/storage/:id",
  verifyAdmin,
  verifyRole,
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
