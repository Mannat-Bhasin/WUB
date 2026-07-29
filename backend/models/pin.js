import mongoose from 'mongoose'

const pinSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },
    lng: { type: Number, required: true },
    lat: { type: Number, required: true },
    isFavorite: { type: Boolean, default: false },
    hasPhotos: { type: Boolean, default: false },
    description: { type: String, default: '' },
    photos: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
)

const Pin = mongoose.model('pin', pinSchema)
export default Pin