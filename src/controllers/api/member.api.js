import { Member } from "../../models/member.model.js";

const INTERNAL_ERROR_MSG = "Internal Server Error";
const memberApi = {};

memberApi.listMembers = async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }

  try {
    const memberList = await Member.find(searchOptions);

    res.json(memberList);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberApi.memberProfile = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id, {
      password: 0,
    });

    if (!member) {
      return res.status(400).json({ message: "Utilizador não encontrado." });
    }

    await member.populate({
      path: "deals",  
      populate: {
        path: "owner",
        select: "name",
      },
    });

    res.json(member);
  } catch (error) {
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
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

export { memberApi };
