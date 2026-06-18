import { deleteFromCloudinary } from "../../config/cloudinary.js";
import { Business } from "../../models/business.model.js";
import { Member } from "../../models/member.model.js";
import { Suggestion } from "../../models/suggestion.model.js";

const INTERNAL_ERROR_MSG = "Internal Server Error";
const memberApi = {};

memberApi.listMembers = async (req, res) => {
  try {
    const { name } = req.query;
    let searchOptions = {};

    if (name && name.trim() !== "") {
      searchOptions.name = new RegExp(name, "i");
    }

    const matchingMembers = await Member.find(searchOptions);

    return res.status(200).json(matchingMembers);
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);
    return res.status(500).json(error.name + " " + error.message);
  }
};

memberApi.listMemberSuggest = async (req, res) => {
  const { dealId, excludeId } = req.query;

  let idsToExclude = [];

  if (req.user && req.user.id) {
    idsToExclude.push(req.user.id);
  }

  if (excludeId) {
    idsToExclude.push(excludeId);
  }

  try {
    const memberList = await Member.find({ _id: { $nin: idsToExclude } }).sort({
      name: 1,
    });

    let alreadySuggestedIds = [];
    if (dealId) {
      const existingSuggestions = await Suggestion.find({
        deal: dealId,
      }).select("suggestedTo");
      alreadySuggestedIds = existingSuggestions.map((s) =>
        s.suggestedTo.toString(),
      );
    }

    return res.json({
      members: memberList,
      alreadySuggestedIds: alreadySuggestedIds,
    });
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);
    return res.status(500).json(error.name + " " + error.message);
  }
};

memberApi.memberProfile = async (req, res) => {
  try {
    let memberId = req.params.id;

    if (
      !memberId ||
      memberId === "null" ||
      memberId === "undefined" ||
      memberId === ""
    ) {
      memberId = req.user.id;
    }

    const isOwnProfile = memberId === req.user.id;

    let dealConditions = {};

    if (!isOwnProfile) {
      dealConditions = {
        state: { $in: ["Fechado", "Disponivel"] },
        confidential: false,
      };
    }

    const member = await Member.findById(memberId)
      .select("-password")
      .populate({
        path: "deals",
        match: dealConditions,
        populate: {
          path: "owner",
          select: "name profilePicture",
        },
      })
      .lean();

    if (!member) {
      return res.status(404).json("Utilizador não encontrado.");
    }

    if (member.deals && member.deals.length > 0) {
      let matchedDealsArray = [];

      if (memberId === req.user.id) {
        matchedDealsArray = member.matchedDeals || [];
      } else {
        const currentUser = await Member.findById(req.user.id)
          .select("matchedDeals")
          .lean();
        matchedDealsArray = currentUser?.matchedDeals || [];
      }

      const matchedDealsSet = new Set(
        matchedDealsArray.map((id) => id.toString()),
      );

      member.deals.forEach((deal) => {
        deal.isMatched = matchedDealsSet.has(deal._id.toString());
      });
    }

    const ordemEstados = {
      Disponivel: 1,
      Fechado: 2,
      Cancelado: 3,
    };

    member.deals.sort((a, b) => {
      const pesoA = ordemEstados[a.state] || 4;
      const pesoB = ordemEstados[b.state] || 4;

      if (pesoA !== pesoB) {
        return pesoA - pesoB;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.status(200).json(member);
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);
    return res.status(500).json(error.name + " " + error.message);
  }
};

memberApi.editMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json("Membro não encontrado.");
    }

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      city: req.body.city,
      dateOfBirth: req.body.dateOfBirth,
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

    if (req.body.removeProfilePicture === "true") {
      if (member.profilePicture) {
        await deleteFromCloudinary(member.profilePicture);
      }
      updateData.profilePicture = null;
    } else if (req.file) {
      if (member.profilePicture) {
        await deleteFromCloudinary(member.profilePicture);
      }
      updateData.profilePicture = req.file.path;
    }

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { returnDocument: "after", runValidators: true },
    );

    return res.status(200).json("Membro editado com Sucesso.");
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);

    if (error.name === "ValidationError") {
      const frontendError = error.message.split(":")[2].trim();
      return res.status(500).json(frontendError);
    }

    return res.status(500).json(error.name + " " + error.message);
  }
};

memberApi.changePassword = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json("Membro não encontrado.");
    }

    const { oldPassword, newPassword, repeatPassword } = req.body;

    const isOldPasswordCorrect = await member.comparePassword(oldPassword);
    if (!isOldPasswordCorrect) {
      return res.status(400).json("A senha atual inserida está incorreta.");
    }

    if (newPassword !== repeatPassword) {
      return res.status(400).json("A nova senha e a repetição não coincidem.");
    }

    const isSameAsOld = await member.comparePassword(newPassword);
    if (isSameAsOld) {
      return res
        .status(400)
        .json("A nova senha não pode ser igual à senha atual.");
    }
    member.password = newPassword;

    await member.save();

    return res.status(200).json("Senha alterada com sucesso!");
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);

    // fazer isso pra todos os erros que vao pro frontend?
    if (error.name === "ValidationError") {
      const frontendError = error.message.split(":")[2].trim();
      return res.status(500).json(frontendError);
    }

    return res.status(500).json(error.name + " " + error.message);
  }
};

memberApi.addBusiness = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json("Membro não encontrado.");
    }

    let businessLogoUri = null;

    console.log(req.file);

    if (req.file) {
      businessLogoUri = req.file.path;
    }

    const business = new Business({
      name: req.body.name,
      role: req.body.role,
      description: req.body.description,
      area: req.body.area,
      logo: businessLogoUri,
    });

    member.business.push(business);

    await member.save();

    return res.status(201).json("Empresa Criada com Sucesso.");
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);

    if (error.name === "ValidationError") {
      const frontendError = error.message.split(":")[2].trim();
      return res.status(500).json(frontendError);
    }

    return res.status(500).json(error.name + " " + error.message);
  }
};

memberApi.editBusiness = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json("Membro não encontrado.");
    }

    const business = member.business.id(req.params.bid);
    if (!business) {
      return res.status(404).json("Negócio não encontrado.");
    }

    let businessLogoUrl = business.logo;

    if (req.body.removeLogo === "true") {
      if (business.logo) {
        await deleteFromCloudinary(business.logo);
      }
      business.logo = null;
    } else if (req.file) {
      if (business.logo) {
        await deleteFromCloudinary(business.logo);
      }
      business.logo = req.file.path;
    }

    business.name = req.body.name;
    business.role = req.body.role;
    business.description = req.body.description;
    business.area = req.body.area;

    await member.save();

    return res.status(200).json("Empressa editada com Sucesso.");
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);

    if (error.name === "ValidationError") {
      const frontendError = error.message.split(":")[2].trim();
      return res.status(500).json(frontendError);
    }

    return res.status(500).json(error.name + " " + error.message);
  }
};

memberApi.deleteBusiness = async (req, res) => {
  try {
    const { id, bid } = req.params;

    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json("Membro não encontrado.");
    }

    const businessToDelete = member.business.id(bid);
    if (businessToDelete && businessToDelete.logo) {
      await deleteFromCloudinary(businessToDelete.logo);
    }

    await Member.findByIdAndUpdate(id, {
      $pull: { business: { _id: bid } },
    });

    return res.status(200).json("Empresa deletada com Sucesso.");
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);

    if (error.name === "ValidationError") {
      const frontendError = error.message.split(":")[2].trim();
      return res.status(500).json(frontendError);
    }

    return res.status(500).json(error.name + " " + error.message);
  }
};

memberApi.deactivateAccount = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json("Membro não encontrado.");
    }

    await Member.findByIdAndUpdate(req.params.id, { state: "Inativo" });

    return res.status(200).json("Conta Desativada com sucesso.");
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);
    return res.status(500).json(error.name + " " + error.message);
  }
};

export { memberApi };
