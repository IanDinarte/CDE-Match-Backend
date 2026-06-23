import mongoose, { Schema } from "mongoose";

const BusinessSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Member",
  },
});

export const Business = mongoose.model("Business", BusinessSchema);
