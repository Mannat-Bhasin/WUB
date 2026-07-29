import Pin from '../models/pin.js'

export const createPin = async (data) => Pin.create(data)

export const findPinsByUser = async (userId) =>
  Pin.find({ user: userId }).sort({ createdAt: 1 })

export const findPinByIdAndUser = async (id, userId) =>
  Pin.findOne({ _id: id, user: userId })

export const updatePinById = async (id, userId, update) =>
  Pin.findOneAndUpdate({ _id: id, user: userId }, update, { new: true })