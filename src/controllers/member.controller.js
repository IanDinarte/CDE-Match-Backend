import { sendMemberWelcomeEmail } from "../config/mailer.js";
import { Business } from "../models/business.model.js";
import { Member } from "../models/member.model.js";

const INTERNAL_ERROR_MSG = "Internal Server Error";

const memberController = {};

memberController.listMembers = async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const member = await Member.find(searchOptions);

    res.render("admin/account_management/member/index", {
      member: member,
      searchOptions: req.query,
    });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

memberController.newMemberPage = async (req, res) => {
  try {
    res.render("admin/account_management/member/new", { member: new Member() });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.newMember = async (req, res) => {
  try {
    const profileImageUrl = req.file ? req.file.path : "/assets/default.png";

    const member = new Member({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      description: req.body.description,
      city: req.body.city,
      dateOfBirth: req.body.dateOfBirth,
      phone: req.body.phone,
      profilePicture: profileImageUrl,
    });

    const newMember = await member.save();

    // await sendMemberWelcomeEmail(
    //   req.body.email,
    //   req.body.name,
    //   req.body.password,
    // );

    res.redirect(`/admin/manage-accounts/member/${newMember._id}`);
  } catch (error) {
    if (error.name === "ValidationError") {
      console.log(error.message);

      return;
    }
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.memberProfile = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id, {
      password: 0,
    });

    if (!member) {
      return res.status(400).json({ message: "Utilizador não encontrado." });
    }

    res.render("admin/account_management/member/show", { member: member });
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.editMemberPage = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    res.render("admin/account_management/member/edit", { member: member });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.editMember = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.profilePicture = req.file.path;
    }

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    res.redirect(`/admin/manage-accounts/member/${updatedMember.id}`);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.businessDetails = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    const business = member.business.id(req.params.bid);

    res.render("admin/account_management/member/business/show", {
      business: business,
      member: member,
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.newBusinessPage = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    res.render("admin/account_management/member/business/new", {
      business: new Business(),
      member: member,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.newBusiness = async (req, res) => {
  try {
    const logoUrl = req.file ? req.file.path : "/assets/defaultLogo.png";

    const member = await Member.findById(req.params.id);

    const business = new Business({
      name: req.body.name,
      role: req.body.role,
      description: req.body.description,
      area: req.body.area,
      logo: logoUrl,
    });

    member.business.push(business);

    await member.save();

    res.redirect(`/admin/manage-accounts/member/${member.id}`);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.editBusinessPage = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    const business = member.business.id(req.params.bid);
    res.render("admin/account_management/member/business/edit", {
      business: business,
      member: member,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.editBusiness = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    const logo = req.file ? req.file.path : "/assets/defaultLogo.png";

    const business = member.business.id(req.params.bid);

    business.name = req.body.name;
    business.role = req.body.role;
    business.description = req.body.description;
    business.area = req.body.area;
    business.logo = logo;

    await member.save();

    res.redirect(`/admin/manage-accounts/member/${member.id}`);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.deleteBusiness = async (req, res) => {
  try {
    const { id, bid } = req.params;

    await Member.findByIdAndUpdate(id, {
      $pull: { business: { _id: bid } },
    });

    res.redirect(`/admin/manage-accounts/member/${id}`);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.deleteMember = async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.redirect("/admin/manage-accounts/member/");

    res.status(200).json({ message: "Perfil excluído com sucesso" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

// memberController.deactivateMember = async (req, res) => {
//   const member = await Member.findById(req.params.id);
//   try {
//     member.active = false;
//     res.redirect("/admin/manage-accounts/member/");
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
//   }
// };

export { memberController };
