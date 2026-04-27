import { Admin } from "../models/admin.model.js";
import { sendAdminWelcomeEmail } from "../config/mailer.js";

const INTERNAL_ERROR_MSG = "Internal Server Error";

const adminController = {};

adminController.listAdmins = async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const admin = await Admin.find(searchOptions);

    res.render("admin/account_management/admin/index", {
      admin: admin,
      searchOptions: req.query,
    });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

adminController.newAdminPage = async (req, res) => {
  try {
    res.render("admin/account_management/admin/new", { admin: new Admin() });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

adminController.newAdmin = async (req, res) => {
  try {
    const admin = new Admin({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const newAdmin = await admin.save();

    //await sendAdminWelcomeEmail(req.body.email, req.body.name, req.body.password)

    res.redirect(`/admin/manage-accounts/admin/${newAdmin._id}`);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

adminController.adminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.render("admin/account_management/admin/show", { admin: admin });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

adminController.editAdminPage = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.render("admin/account_management/admin/edit", { admin: admin });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

adminController.editAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    admin.name = req.body.name;
    admin.email = req.body.email;
    admin.state = req.body.state;

    await admin.save();
    res.redirect(`/admin/manage-accounts/admin/${admin.id}`);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

adminController.deleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.redirect("/admin/manage-accounts/admin/");

    res.status(200).json({ message: "Perfil excluído com sucesso" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

// adminController.deactivateAdmin = async (req, res) => {
//   const admin = await Admin.findById(req.params.id);
//   try {
//     admin.active = false;
//     res.redirect("/admin/manage-accounts/admin/");
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
//   }
// };

export { adminController };
