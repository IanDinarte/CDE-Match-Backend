import { deleteFromCloudinary } from "../config/cloudinary.js";
import { sendMemberWelcomeEmail } from "../config/mailer.js";
import { Business } from "../models/business.model.js";
import { Deal } from "../models/deal.model.js";
import { Member } from "../models/member.model.js";
import { Suggestion } from "../models/suggestion.model.js";

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
    const profileImageUrl = req.file ? req.file.path : null;

    const names = Array.isArray(req.body.websiteNames)
      ? req.body.websiteNames
      : [req.body.websiteNames || ""];
    const links = Array.isArray(req.body.websiteLinks)
      ? req.body.websiteLinks
      : [req.body.websiteLinks || ""];

    const websites = names
      .map((name, index) => {
        let link = links[index].trim();

        if (link && !/^https?:\/\//i.test(link)) {
          link = `https://${link}`;
        }

        return { name: name.trim(), link: link };
      })
      .filter((site) => site.name !== "" || site.link !== "");

    const member = new Member({
      name: req.body.name,
      email: {
        value: req.body.email,
        confidential: req.body.emailConfidential === "on", // Converte "on" para true, e undefined para false
      },
      phone: {
        value: req.body.phone,
        confidential: req.body.phoneConfidential === "on", // Converte "on" para true, e undefined para false
      },
      password: req.body.password,
      description: req.body.description,
      city: req.body.city,
      dateOfBirth: req.body.dateOfBirth,
      profilePicture: profileImageUrl,
      websites: websites,
    });

    const newMember = await member.save();

    await sendMemberWelcomeEmail(
      req.body.email,
      req.body.name,
      req.body.password,
    );

    res.redirect(`/admin/manage-accounts/member/${newMember._id}`);
  } catch (error) {
    const names = Array.isArray(req.body.websiteNames)
      ? req.body.websiteNames
      : [req.body.websiteNames || ""];
    const links = Array.isArray(req.body.websiteLinks)
      ? req.body.websiteLinks
      : [req.body.websiteLinks || ""];

    const websitesMapped = names.map((name, index) => ({
      name: name,
      link: links[index],
    }));

    const memberData = new Member(req.body);
    memberData.websites = websitesMapped;

    memberData.isNew = true;

    return res.render("admin/account_management/member/new", {
      member: memberData,
      errorMessage: error.message,
    });
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
    const currentMember = await Member.findById(req.params.id);
    if (!currentMember) {
      return res.status(404).json({ message: "Membro não encontrado." });
    }

    let profileImageUrl = currentMember.profilePicture;
    
    if (req.file) {
      if (currentMember.profilePicture) {
        await deleteFromCloudinary(currentMember.profilePicture);
      }
      profileImageUrl = req.file.path;
    } else if (req.body.removeProfilePicture === "true") {
      if (currentMember.profilePicture) {
        await deleteFromCloudinary(currentMember.profilePicture);
      }
      profileImageUrl = null;
    }

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      city: req.body.city,
      dateOfBirth: req.body.dateOfBirth,
      profilePicture: profileImageUrl,
      state: req.body.state,
    };

    updateData.email = {
      value: req.body.email,
      confidential: req.body.emailConfidential === "on",
    };

    updateData.phone = {
      value: req.body.phone,
      confidential: req.body.phoneConfidential === "on",
    };

    const names = Array.isArray(req.body.websiteNames)
      ? req.body.websiteNames
      : [req.body.websiteNames || ""];
    const links = Array.isArray(req.body.websiteLinks)
      ? req.body.websiteLinks
      : [req.body.websiteLinks || ""];

    updateData.websites = names
      .map((name, index) => {
        let link = links[index].trim();

        if (link && !/^https?:\/\//i.test(link)) {
          link = `https://${link}`;
        }

        return { name: name.trim(), link: link };
      })
      .filter((site) => site.name !== "" || site.link !== "");

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { returnDocument: "after", runValidators: true },
    );

    res.redirect(`/admin/manage-accounts/member/${updatedMember.id}`);
  } catch (error) {
    console.log(error.message);
    const names = Array.isArray(req.body.websiteNames)
      ? req.body.websiteNames
      : [req.body.websiteNames || ""];
    const links = Array.isArray(req.body.websiteLinks)
      ? req.body.websiteLinks
      : [req.body.websiteLinks || ""];

    const websitesMapped = names.map((name, index) => ({
      name: name,
      link: links[index],
    }));

    const memberData = new Member(req.body);
    memberData.websites = websitesMapped;

    memberData.isNew = false;

    return res.render("admin/account_management/member/edit", {
      member: memberData,
      errorMessage: error.message,
    });
  }
};

memberController.businessDetails = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    const business = member.business.id(req.params.bid);

    res.render("admin/account_management/member/business/show", {
      business: business,
      member: member,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      console.log(error.message);

      return;
    }
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
    const logoUrl = req.file ? req.file.path : null;

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
    if (!member) {
      return res.status(404).json({ message: "Membro não encontrado." });
    }

    const business = member.business.id(req.params.bid);
    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado." });
    }

    let businessLogoUrl = business.logo;

    if (req.file) {
      if (business.logo) {
        await deleteFromCloudinary(business.logo);
      }
      businessLogoUrl = req.file.path;
    } else if (req.body.removeBusinessLogo === "true") {
      if (business.logo) {
        await deleteFromCloudinary(business.logo);
      }
      businessLogoUrl = null;
    }

    business.name = req.body.name;
    business.role = req.body.role;
    business.description = req.body.description;
    business.area = req.body.area;
    business.logo = businessLogoUrl;

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

    const member = await Member.findById(id);
    if (!member) {
      return res.redirect(`/admin/manage-accounts/member`);
    }

    const businessToDelete = member.business.id(bid);
    if (businessToDelete && businessToDelete.logo) {
      await deleteFromCloudinary(businessToDelete.logo);
    }

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
    const memberToDelete = await Member.findById(req.params.id);

    if (!memberToDelete) {
      return res.redirect("/admin/manage-accounts/member");
    }

    if (memberToDelete.state == "Inativo") {
      if (memberToDelete.profilePicture) {
        await deleteFromCloudinary(memberToDelete.profilePicture);
      }

      const memberDeals = await Deal.find({ owner: memberToDelete._id }).select(
        "_id",
      );
      const dealIds = memberDeals.map((deal) => deal._id);

      if (dealIds.length > 0) {
        await Suggestion.deleteMany({ deal: { $in: dealIds } });
        await Deal.deleteMany({ owner: memberToDelete._id });
        console.log(
          `Cascata: ${dealIds.length} negócios e as suas sugestões foram limpos.`,
        );
      }

      await Suggestion.deleteMany({
        $or: [
          { suggestedTo: memberToDelete._id },
          { suggestedBy: memberToDelete._id },
        ],
      });

      await memberToDelete.deleteOne();

      res.redirect("/admin/manage-accounts/member");
    } else {
      res.redirect(`/admin/manage-accounts/member/${memberToDelete._id}`);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

export { memberController };
