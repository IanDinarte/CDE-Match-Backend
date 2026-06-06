import { deleteFromCloudinary } from "../../config/cloudinary.js";
import { Business } from "../../models/business.model.js";
import { Member } from "../../models/member.model.js";
import { Suggestion } from "../../models/suggestion.model.js";

const INTERNAL_ERROR_MSG = "Internal Server Error";
const memberApi = {};

memberApi.listMembersSuggest = async (req, res) => {
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

    res.json({
      members: memberList,
      alreadySuggestedIds: alreadySuggestedIds,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberApi.memberProfile = async (req, res) => {
  try {
    let memberId = req.params.id;

    if (memberId === "null" || memberId === "undefined" || memberId === "") {
      memberId = null;
    }

    const member =
      memberId == null
        ? await Member.findById(req.user.id, {
            password: 0,
          })
        : await Member.findById(memberId, {
            password: 0,
          });

    if (!member) {
      return res.status(400).json({ message: "Utilizador não encontrado." });
    }

    await member.populate({
      path: "deals",
      populate: {
        path: "owner",
        select: "name profilePicture",
      },
    });

    res.json(member);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

// memberApi.me = async (req, res) => {
//   try {
//     const member = await Member.findById(req.user.id, { password: 0 });

//     if (!member) {
//       return res.status(400).json({ message: "Membro não encontrado." });
//     }

//     await member.populate({
//       path: "deals",
//       populate: {
//         path: "owner",
//         select: "name profilePicture",
//       },
//     });

//     res.json(member);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
//   }
// };

memberApi.editMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Membro não encontrado." });
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

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { returnDocument: "after", runValidators: true },
    );

    res.json(updatedMember);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberApi.addBusiness = async (req, res) => {
  try {
    //const logoUrl =

    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Membro não encontrado." });
    }

    const business = new Business({
      name: req.body.name,
      role: req.body.role,
      description: req.body.description,
      area: req.body.area,
      //logo: logoUrl,
    });

    member.business.push(business);

    await member.save();

    res.status(201).json(business);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberApi.editBusiness = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Membro não encontrado." });
    }

    const business = member.business.id(req.params.bid);
    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado." });
    }

    business.name = req.body.name;
    business.role = req.body.role;
    business.description = req.body.description;
    business.area = req.body.area;
    // business.logo = businessLogoUrl;

    await member.save();

    res.status(200).json(business);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberApi.deleteBusiness = async (req, res) => {
  try {
    const { id, bid } = req.params;

    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Membro não encontrado." });
    }

    const businessToDelete = member.business.id(bid);
    if (businessToDelete && businessToDelete.logo) {
      await deleteFromCloudinary(businessToDelete.logo);
    }

    await Member.findByIdAndUpdate(id, {
      $pull: { business: { _id: bid } },
    });

    res.status(200).json();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

export { memberApi };
