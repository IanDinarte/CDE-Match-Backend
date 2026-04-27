import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { Business } from "./business.model.js";

/**
 * state: estado da conta (ativo ou inativo)
 */
const MemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const eighteenYearsAgo = new Date();

        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

        return value <= eighteenYearsAgo;
      },
      message: "Idade Inválida.",
    },
  },
  membership: {
    type: String,
    enum: ["Convidado", "Silver", "Gold", "Black"],
    default: "Convidado"
  },
  city: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  websites: [
    {
      //websites + socials (instagram, facebook, etc)
      type: String,
    },
  ],
  business: [
    Business.schema
  ],
  profilePicture: {
    type: Buffer,
  },
  state: {
    type: String,
    enum: ["Ativo", "Inativo"],
    default: "Ativo",
  },
});

MemberSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return "N/A";

  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
});

MemberSchema.virtual("dateOfBirthFormatted").get(function () {
  if (!this.dateOfBirth) return "";
  return this.dateOfBirth.toISOString().split("T")[0];
});

MemberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

MemberSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

MemberSchema.set("toJSON", { virtuals: true });
MemberSchema.set("toObject", { virtuals: true });

export const Member = mongoose.model("Member", MemberSchema);
