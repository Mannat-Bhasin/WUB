import { createPin, findPinsByUser, findPinByIdAndUser, updatePinById } from '../repositories/pin-repo.js'
import cloudinary from '../config/cloudinary.js'

export const addPin = async (userId, { name, lng, lat }) => {
    return createPin({ user: userId, name, lng, lat })
}

export const getPins = async (userId) => {
    return findPinsByUser(userId)
}

export const setFavorite = async (userId, pinId, isFavorite) => {
    const pin = await updatePinById(pinId, userId, { isFavorite })
    if (!pin) throw new Error('Pin not found')
    return pin
}

const uploadOneToCloudinary = (file) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'where-u-been' },
            (err, result) => (err ? reject(err) : resolve(result.secure_url))
        )
        stream.end(file.buffer)
    })

export const uploadPhotosToPin = async (userId, pinId, files) => {
    const pin = await findPinByIdAndUser(pinId, userId)
    if (!pin) throw new Error('Pin not found')

    const urls = await Promise.all(files.map(uploadOneToCloudinary))

    pin.photos.push(...urls.map((url) => ({ url, caption: '' })))
    pin.hasPhotos = true
    pin.isFavorite = false // photographed places auto-leave the wishlist
    await pin.save()
    return pin
}

export const setDescription = async (userId, pinId, description) => {
    const pin = await updatePinById(pinId, userId, { description })
    if (!pin) throw new Error('Pin not found')
    return pin
}