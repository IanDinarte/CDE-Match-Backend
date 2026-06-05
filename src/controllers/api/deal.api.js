import { Deal } from "../../models/deal.model.js";
import { Member } from "../../models/member.model.js";
import { Suggestion } from "../../models/suggestion.model.js";

const INTERNAL_ERROR_MSG = "Internal Server Error";
const dealApi = {};

dealApi.listDeals = async (req, res) => {
  try {
    const { title, type, area, minPrice, maxPrice } = req.query;
    let queryConditions = [];

    queryConditions.push({ confidential: false });
    queryConditions.push({ state: "Disponivel" });

    if (title && title.trim() !== "") {
      const regex = new RegExp(title, "i");
      const matchingMembers = await Member.find({ name: regex }).select("_id");
      const memberIds = matchingMembers.map((member) => member._id);

      queryConditions.push({
        $or: [{ title: regex }, { owner: { $in: memberIds } }],
      });
    }

    if (type && type !== "" && type !== "Todos") {
      queryConditions.push({ type: type });
    }

    if (area && area !== "" && area !== "Todas") {
      queryConditions.push({ area: area });
    }

    if (minPrice || maxPrice) {
      let priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);

      queryConditions.push({ price: priceQuery });
    }

    const searchOptions =
      queryConditions.length > 0 ? { $and: queryConditions } : {};

    const dealList =
      (await Deal.find(searchOptions)
        .populate("owner", "name profilePicture")
        .sort({ createdAt: -1 })) || [];

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

dealApi.newDeal = async (req, res) => {
  try {
    const { title, description, price, type, area, confidential } = req.body;
    const ownerId = req.user.id;

    const newDeal = await Deal.create({
      title: title,
      description: description,
      price: price,
      owner: ownerId,
      type: type,
      area: area,
      confidential: confidential,
    });

    await newDeal.save();

    await Member.findByIdAndUpdate(req.user.id, {
      $push: { deals: newDeal._id },
    });

    res.status(201).json(newDeal.id);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

/**
 * UNFINISHED, NAO USAR
 *
 * A parte de deletar sugestões é feita para apagar as sugestões que sejam
 * de deals canceladas ou fechadas, tirando a necessidade de filtra-las.
 *
 * @param {*} req
 * @param {*} res
 */
dealApi.editDeal = async (req, res) => {
  try {
    const dealId = req.params.id;
    const updatedDeal = await Deal.findByIdAndUpdate(
      dealId,
      { $set: req.body },
      { new: true },
    );

    if (updatedDeal.state === "Fechado" || updatedDeal.state === "Cancelado") {
      await Suggestion.deleteMany({ deal: dealId });
    }

    res.json(updatedDeal);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

dealApi.suggestedDeals = async (req, res) => {
  try {
    const suggestedDeals = await Suggestion.find({ suggestedTo: req.user.id })
      .populate({
        path: "deal",
        populate: {
          path: "owner",
          select: "name profilePicture",
        },
      })
      .populate("suggestedBy", "name")
      .sort({ createdAt: -1 });

    res.json(suggestedDeals || []);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

dealApi.createSuggestion = async (req, res) => {
  try {
    const { dealId, suggestedTo } = req.body;

    const suggestedBy = req.user.id; //usar o protect na route

    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).send("Negócio não encontrado.");
    }

    if (deal.state !== "Disponivel") {
      return res.status(400).send("Negócio não disponivel.");
    }

    const existingSuggestion = await Suggestion.findOne({
      deal: dealId,
      suggestedTo: suggestedTo,
    });

    if (existingSuggestion) {
      //mudar codigo de erro dps :P
      return res
        .status(418)
        .send("Este negócio já foi sugerido a esse membro.");
    }

    const newSuggestion = new Suggestion({
      deal: dealId,
      suggestedTo: suggestedTo,
      suggestedBy: suggestedBy,
      onModel: "Member",
      status: "Enviado",
    });

    await newSuggestion.save();

    res.json(newSuggestion);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

dealApi.rejectSuggestion = async (req, res) => {
  try {
    const suggestionId = req.params.id;

    await Suggestion.findByIdAndDelete(suggestionId);

    res.json();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

export { dealApi };
