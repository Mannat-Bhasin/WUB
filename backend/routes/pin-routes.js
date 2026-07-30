import express from "express";
import upload from "../middleware/upload-middleware.js";
import protect from '../middleware/user-middleware.js'
// import { getPinsHandler, createPinHandler, uploadPhotosHandler, getPhotosForPin, updatePin, setFavoriteHandler } from "../controller/pin-controller1.js";
import {
  createPinHandler,
  getPinsHandler,
  setFavoriteHandler,
  uploadPhotosHandler,
  setDescriptionHandler,
} from '../controller/pin-controller1.js'

const router = express.Router();
router.use(protect)

router.get('/', getPinsHandler)
router.post('/', createPinHandler)
router.patch('/:pinId/favorite', setFavoriteHandler)
router.post('/:pinId/photos', upload.array('photos', 30), uploadPhotosHandler)
router.patch('/:pinId/description', setDescriptionHandler)

export default router;




// const router = express.Router()


// router.use(protect)
// router.get("/", getPins);
// router.post("/", createPin);
// router.patch("/:id", updatePin);
// router.post("/:id/photos", upload.array("photos", 10), uploadPhotos);
// router.get("/:id/photos", getPhotosForPin);
// router.patch('/:id/favorite', setFavorites)

// export default router
