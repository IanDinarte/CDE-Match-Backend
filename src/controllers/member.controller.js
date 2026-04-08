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
    const member = new Member({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const newMember = await member.save();

    res.redirect(`/admin/manage-accounts/member/${newMember._id}`);
  } catch (error) {
    console.log(error.message);
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

memberController.editMemberPage = async (req,res) => {
  try {
      const member = await Member.findById(req.params.id);
      res.render("admin/account_management/member/edit", { member: member });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
    }
}

memberController.editMember = async (req, res) => {
    try {
      const member = await Member.findById(req.params.id);
  
      member.name = req.body.name;
      member.email = req.body.email;
  
      await member.save();
      res.redirect(`/admin/manage-accounts/member/${member.id}`);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
    }
};

memberController.deleteMember = async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.redirect("/admin/manage_accounts/member/");

    res.status(200).json({ message: "Perfil excluído com sucesso" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.deactivateMember = async (req, res) => {
  const member = await Member.findById(req.params.id);
  try {
    member.active = false;
    res.redirect("/admin/manage-accounts/member/");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

export { memberController };
