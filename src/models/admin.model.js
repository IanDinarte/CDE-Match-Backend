import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

/**
 * state: estado da conta (ativo ou inativo)
 */
const AdminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ['Ativo', 'Inativo'],
    default: 'Ativo',
  },
});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

AdminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const Admin = mongoose.model("Admin", AdminSchema);
