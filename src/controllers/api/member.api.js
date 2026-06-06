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

    console.log(memberId);

    const member =
      memberId == null
        ? await Member.findById(req.user.id, {
            password: 0,
          })
        : await Member.findById(memberId, {
            password: 0,
          });

    console.log(req.params.id);

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

memberApi.me = async (req, res) => {
  try {
    const member = await Member.findById(req.user.id, { password: 0 });

    if (!member) {
      return res.status(400).json({ message: "Membro não encontrado." });
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

memberApi.editMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    const updatedMember = await Member.findByIdAndUpdate(
      memberId,
      { $set: req.body },
      { new: true },
    );

    res.json(updatedMember);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

export { memberApi };
