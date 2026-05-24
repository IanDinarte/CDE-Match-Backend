import { Member } from "../../models/member.model.js";
import jwt from "jsonwebtoken";

const INTERNAL_ERROR_MSG = "Internal Server Error";
const authApi = {};

authApi.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const member = await Member.findOne({ "email.value": email });

    if (!member || !(await member.comparePassword(password)) || member.state === "Inativo") {
      return res.status(400).json({ message: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { id: member.id, role: "member" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json(token);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

export { authApi };
