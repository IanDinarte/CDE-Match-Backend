import mongoose, { Schema } from "mongoose";

const AccountCodeSchema = new Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: "Member",
  },
  email: { type: String, required: true },
  valid: { type: Boolean, required: true, default: false },
  resetToken: { type: String, required: false },
  resetTokenExpiration: { type: Date, required: false },
});

export const AccountCode = mongoose.model("AccountCode", AccountCodeSchema);
