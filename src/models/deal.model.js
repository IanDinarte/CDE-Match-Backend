import mongoose, { Schema } from "mongoose";

const DealSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  confidential: {
    type: Boolean,
    required: true,
  },
  ownerId: {
    //owner of the deal
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ['Disponivel', 'Fechado', 'Cancelado'],
    default: 'Disponivel'
  }
});

export const Deal = mongoose.model("Deal", DealSchema);
