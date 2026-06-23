import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { Business } from "./business.model.js";

const scopes = {
  Admin: "admin",
  Member: "member",
};

let RoleSchema = new Schema({
  name: { type: String, required: true },
  scope: [
    {
      type: String,
      enum: [scopes.Member, scopes.Admin],
    },
  ],
});

/**
 * state: estado da conta (ativo ou inativo)
 */
const MemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    value: {
      type: String,
      required: true,
      unique: true,
    },
    confidential: {
      type: Boolean,
      default: false,
    },
  },
  email: {
    value: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor, introduza um email válido",
      ],
    },
    confidential: {
      type: Boolean,
      default: false,
    },
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
    default: "Convidado",
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
      name: String,
      link: String,
    },
  ],
  deals: [
    {
      type: Schema.Types.ObjectId,
      ref: "Deal",
    },
  ],
  business: [Business.schema],
  matchedDeals: [
    {
      type: Schema.Types.ObjectId,
      ref: "Deal",
    },
  ],
  profilePicture: {
    type: String,
  },
  state: {
    type: String,
    enum: ["Ativo", "Inativo"],
    default: "Ativo",
  },
  role: {
    type: RoleSchema,
    default: { name: "Member", scope: ["member"] },
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

// MemberSchema.virtual("dateOfBirthFormatted").get(function () {
//   if (!this.dateOfBirth) return "";
//   return this.dateOfBirth.toISOString().split("T")[0];
// });

MemberSchema.virtual("dateOfBirthFormatted").get(function () {
  if (!this.dateOfBirth || !(this.dateOfBirth instanceof Date)) return "";
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
