import { Admin } from "../models/admin.model.js";

const INTERNAL_ERROR_MSG = "Internal Server Error";

adminController = {};

adminController.registerAdmin = async (req, res) => {
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

adminController.loginAdmin = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

adminController.logoutAdmin = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

adminController.listAdmins = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

adminController.adminProfile = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

adminController.editAdmin = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

adminController.deleteAdmin = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

export { adminController };
