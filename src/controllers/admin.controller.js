import { Admin } from "../models/admin.model.js";

const INTERNAL_ERROR_MSG = "Internal Server Error";

const adminController = {};

adminController.listAdmins = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

adminController.newAdminPage = async (req, res) => {
  try {
    res.render("admin/account_management/admin/new", { admin: new Admin() });
  } catch (error) {}
};

adminController.newAdmin = async (req, res) => {
  // const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
  const admin = new Admin({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    // const { email, password } = req.body;

    // if (!email || !password) {
    //   return res
    //     .status(400)
    //     .json({ message: "Todos as areas devem ser preenchidas." });
    // }

    // const existing = await Admin.findOne({ email: email.toLowerCase() });

    // if (existing) {
    //   return res.status(400).json({
    //     message: "Já existe um administrador registado com esse email.",
    //   });
    // }

    // const admin = await Admin.create({
    //   email: email.toLowerCase,
    //   password: password,
    // });

    const newAdmin = await admin.save();
    res.redirect(`admin/${newAdmin.id}`);
  } catch (error) {
    res.render("admin/account_management/admin/new", {
      admin: admin,
      errorMessage: "Error creating admin",
    });
  }
};

// adminController.loginAdmin = async (req, res) => {
//   try {
//   } catch (error) {
//     res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
//   }
// };

// adminController.logoutAdmin = async (req, res) => {
//   try {
//   } catch (error) {
//     res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
//   }
// };

adminController.adminProfile = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

adminController.editAdminPage = async (req, res) => {};

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
