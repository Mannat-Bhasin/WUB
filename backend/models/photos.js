import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  pinId: { type: mongoose.Schema.Types.ObjectId, ref: "Pin", required: true },
  url: { type: String, required: true },
});
export default mongoose.model("Photo", photoSchema);