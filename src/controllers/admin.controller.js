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

    // await sendAdminWelcomeEmail(
    //   req.body.email,
    //   req.body.name,
    //   req.body.password,
    // );

    res.redirect(`/admin/manage-accounts/admin/${newAdmin._id}`);
  } catch (error) {
    const adminData = new Admin(req.body);
    adminData.isNew = true;

    return res.render("admin/account_management/admin/new", {
      admin: adminData,
      errorMessage: error.message,
    });
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
    const adminData = new Admin(req.body);

    adminData.isNew = false;

    return res.render("admin/account_management/admin/edit", {
      admin: adminData,
      errorMessage: error.message,
    });
  }
};

adminController.deleteAdmin = async (req, res) => {
  try {
    const adminToDelete = await Admin.findById(req.params.id);

    if (adminToDelete.state == "Inativo" && req.user.id != req.params.id) {
      await adminToDelete.deleteOne();
      res.redirect("/admin/manage-accounts/admin/");
    } else {
      res.redirect(`/admin/manage-accounts/admin/${adminToDelete._id}`);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

export { adminController };
