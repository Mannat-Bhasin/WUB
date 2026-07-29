import { addPin, getPins, setFavorite, uploadPhotosToPin, setDescription } from '../services/pin-service.js'

export const createPinHandler = async (req, res) => {
  try {
    const pin = await addPin(req.id, req.body)
    res.status(201).json(pin)
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const getPinsHandler = async (req, res) => {
  try {
    const pins = await getPins(req.id)
    res.status(200).json(pins)
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const setFavoriteHandler = async (req, res) => {
  try {
    const pin = await setFavorite(req.id, req.params.pinId, req.body.isFavorite)
    res.status(200).json(pin)
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const uploadPhotosHandler = async (req, res) => {
  try {
    const pin = await uploadPhotosToPin(req.id, req.params.pinId, req.files)
    res.status(200).json(pin)
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const setDescriptionHandler = async (req, res) => {
  try {
    const pin = await setDescription(req.id, req.params.pinId, req.body.description)
    res.status(200).json(pin)
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}