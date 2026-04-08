import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

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
  },
  city: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  websites: [
    {
      //websites + socials (instagram, facebook, etc)
      type: String,
      required: false,
    },
  ],
  profilePicture: {
    type: Buffer,
    required: false,
  },
});

MemberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

MemberSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const Member = mongoose.model("Member", MemberSchema);
