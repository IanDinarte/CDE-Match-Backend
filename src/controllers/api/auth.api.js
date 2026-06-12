import { Member } from "../../models/member.model.js";
import jwt from "jsonwebtoken";

const INTERNAL_ERROR_MSG = "Internal Server Error";
const authApi = {};

authApi.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const member = await Member.findOne({ "email.value": email });

    if (
      !member ||
      !(await member.comparePassword(password)) ||
      member.state === "Inativo"
    ) {
      return res.status(400).json({ message: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { id: member.id, role: "member" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json(token);
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);
    return res.status(500).json(error.name + " " + error.message);  
  }
};

export { authApi };
