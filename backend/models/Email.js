import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  messageId: { type: String, unique: true, required: true }, 
  sender: String,
  senderEmail: String,
  subject: String,
  category: { 
    type: String, 
    enum: ["business-lead", "report", "general"], 
    default: "general" 
  },
  timestamp: Date,
  preview: String
});

export default mongoose.model("Email", emailSchema);
