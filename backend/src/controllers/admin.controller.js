import { Admin } from "../models/admin.model";

const INTERNAL_ERROR_MSG = "Internal Server Error";

const RegisterAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Todos as areas devem ser preenchidas." });
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() });

    if (existing) {
      return res.status(400).json({
        message: "Já existe um administrador registado com esse email.",
      });
    }

    const admin = await Admin.create({
      email: email.toLowerCase,
      password: password,
    });
    
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

const LoginAdmin = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

const LogoutAdmin = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

const EditAdmin = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

const DeleteAdmin = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

export { RegisterAdmin, LoginAdmin, LogoutAdmin, EditAdmin, DeleteAdmin };
