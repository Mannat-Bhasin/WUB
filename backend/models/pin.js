import mongoose from "mongoose";

const pinSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lng: { type: Number, required: true },
  lat: { type: Number, required: true },
  description: { type: String, default: "" },
  photos: {
    type: [String],
    default: []
},
userId: {
    type: String,
    default: "default-user",   // placeholder for now
  },
});

export default mongoose.model("Pin", pinSchema);