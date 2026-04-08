import mongoose, { Schema } from "mongoose";

const BusinessSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userPosition: {
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
    type: Buffer,
    required: false,
  },
});

export const Business = mongoose.model("Business", BusinessSchema);
