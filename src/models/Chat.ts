import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  isPin:{type: Boolean, default:false},
  uniqueId: { type: String, required: true, unique: true },
},{ timestamps: true });

export default mongoose.models.chat || mongoose.model("chat",ChatSchema)