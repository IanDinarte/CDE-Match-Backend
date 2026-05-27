import { Deal } from "../../models/deal.model.js";
import { Member } from "../../models/member.model.js";

const INTERNAL_ERROR_MSG = "Internal Server Error";
const dealApi = {};

dealApi.listDeals = async (req, res) => {
  let searchOptions = {};
  if (req.query.title != null && req.query.title !== "") {
    searchOptions.title = new RegExp(req.query.title, "i");
  }

  try {
    if (req.query.namer != null && req.query.namer !== "") {
      const matchingMembers = await Member.find({
        name: new RegExp(req.query.namer, "i"),
      }).select("_id");

      const memberIds = matchingMembers.map((member) => member._id);

      searchOptions.owner = { $in: memberIds };
    }

    const dealList = (await Deal.find(searchOptions).populate("owner", "name profilePicture")) || [];

    res.json(dealList);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

dealApi.dealDetails = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    await deal.populate("owner");

    if (!deal) {
      return res.status(400).json({ message: "Negócio não encontrado." });
    }

    res.json(deal);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

export { dealApi };
