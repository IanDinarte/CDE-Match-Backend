import { Admin } from "../models/admin.model.js";
import jwt from "jsonwebtoken";

const INTERNAL_ERROR_MSG = "Internal Server Error";

const authController = {};

authController.loginPage = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.comparePassword(password)) || admin.state == 'Inativo') {
      return res.render("login", { errorMessage: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, //1 dia
    });

    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

authController.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
};

/**
 * NOTAS: Register fazer diferente, tipo enviar um email pra empresa pra confirmar a criação do admin?
 * @param {*} req
 * @param {*} res
 */
authController.registerPage = async (req, res) => {
  try {
    res.render("admin/account_management/admin/new", { admin: new Admin() });
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

authController.register = async (req, res) => {
  try {
    const admin = new Admin({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const newAdmin = await admin.save();
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

authController.setUser = function (req, res, next) {
  const authToken = req.cookies.token;
  if (!authToken) {
    res.locals.user = null;
    return next();
  }

  jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.locals.user = null;
      res.clearCookie("token");
    } else {
      res.locals.user = decoded;
      req.user = decoded;
    }
    next();
  });
};

authController.verifyLogin = (req, res, next) => {
  if (!res.locals.user) {
    return res.redirect("/auth/login");
  }
  next();
};

export { authController };
