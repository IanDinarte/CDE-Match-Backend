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
    unique: [true, "Email já registado."],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Por favor, introduza um email válido",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "A senha deve ter no mínimo 6 caracteres"],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial",
    ],
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
