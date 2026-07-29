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
import express from 'express'
import protect from '../middleware/user-middleware.js'
import upload from '../middleware/upload-middleware.js'
import {
  createPinHandler,
  getPinsHandler,
  setFavoriteHandler,
  uploadPhotosHandler,
  setDescriptionHandler,
} from '../controller/pin-controller.js'

const router = express.Router()

router.use(protect)

router.get('/', getPinsHandler)
router.post('/', createPinHandler)
router.patch('/:pinId/favorite', setFavoriteHandler)
router.post('/:pinId/photos', upload.array('photos', 10), uploadPhotosHandler)
router.patch('/:pinId/description', setDescriptionHandler)

export default router
