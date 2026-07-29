import express from "express";
import upload from "../middleware/upload-middleware.js";
import { getPins, createPin, uploadPhotos, getPhotosForPin, updatePin } from "../controller/photos-controller.js";

const router = express.Router();

router.get("/", getPins);
router.post("/", createPin);
router.patch("/:id", updatePin);
router.post("/:id/photos", upload.array("photos", 10), uploadPhotos);
router.get("/:id/photos", getPhotosForPin);

export default router;