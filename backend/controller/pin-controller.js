import Pin from "../models/pin.js";
import Photo from "../models/photos.js"
import  { addPin, getPin, setFavorite, uploadPhotosToPin, setDescription } from '../services/pin-service.js'

export const uploadPhotos = async (req, res) => {
  try {
    const { id } = req.params;

    // Cloudinary URLs
    const urls = req.files.map((file) => file.path);

    // Add new photos to the existing photos array
    const updatedPin = await Pin.findByIdAndUpdate(
      id,
      {
        $push: {
          photos: { $each: urls }
        }
      },
      { new: true }
    );

    res.json({
      urls: updatedPin.photos
    });

  } catch (err) {
    console.error("Upload error:", err.message);
    console.error(err.stack);

    res.status(500).json({
      error: err.message
    });
  }
};


export const updatePin = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const pin = await Pin.findByIdAndUpdate(
      id,
      { description },
      { new: true } // return the updated doc, not the old one
    );

    if (!pin) return res.status(404).json({ error: "Pin not found" });

    res.json(pin);
  } catch (err) {
    console.error("Update pin error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getPins = async (req, res) => {
  const { userId } = req.query;
  const filter = userId ? { userId } : {};
  const pins = await Pin.find(filter);
  res.json(pins);
};

export const createPin = async (req, res) => {
  const { name, lng, lat, userId } = req.body;
  const pin = await Pin.create({ name, lng, lat, userId: userId || "default-user", });
  res.json(pin);
};

export const getPhotosForPin = async (req, res) => {
  const photos = await Photo.find({ pinId: req.params.id });
  res.json(photos);
};

export const setFavorites = async (req, res) => {
  try {
    const pin = await setFavorite(req.id, req.params.pinId, req.body.isFavorite)
    res.status(200).json(pin)
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}