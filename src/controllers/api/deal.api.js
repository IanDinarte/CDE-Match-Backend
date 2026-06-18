import { Deal } from "../../models/deal.model.js";
import { Member } from "../../models/member.model.js";
import { Suggestion } from "../../models/suggestion.model.js";

const INTERNAL_ERROR_MSG = "Internal Server Error";
const dealApi = {};

dealApi.listDeals = async (req, res) => {
  try {
    const { title, type, area, minPrice, maxPrice, matchFilter } = req.query;

    const currentUser = await Member.findById(req.user.id).select(
      "matchedDeals",
    );

    const userMatchesArray = currentUser?.matchedDeals || [];
    const userMatchesStrings = userMatchesArray.map((id) => id.toString());

    let queryConditions = [];

    queryConditions.push({ confidential: false });
    queryConditions.push({ state: "Disponivel" });

    if (matchFilter === "2") {
      if (userMatchesArray.length > 0) {
        queryConditions.push({ _id: { $nin: userMatchesArray } });
      }
    } else if (matchFilter === "1") {
      queryConditions.push({ _id: { $in: userMatchesArray } });
    }

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

    const dealListFinal = dealList.map((deal) => {
      const dealObj = deal.toObject();
      dealObj.isMatched = userMatchesStrings.includes(dealObj._id.toString());
      return dealObj;
    });

    return res.status(200).json(dealListFinal);
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);
    return res.status(500).json(error.name + " " + error.message);
  }
};

dealApi.dealDetails = async (req, res) => {
  try {
    const dealId = req.params.id;

    const deal = await Deal.findById(dealId)
      .populate("owner", "name profilePicture")
      .lean();

    if (!deal) {
      return res.status(404).json("Negócio não encontrado.");
    }

    const matchExists = await Member.exists({
      _id: req.user.id,
      matchedDeals: dealId,
    });

    deal.isMatched = !!matchExists;

    return res.status(200).json(deal);
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);
    return res.status(500).json(error.name + " " + error.message);
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

    return res.status(201).json("Negócio criado com Sucesso.");
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);

    if (error.name === "ValidationError") {
      const frontendError = error.message.split(":")[2].trim();
      return res.status(500).json(frontendError);
    }

    return res.status(500).json(error.name + " " + error.message);
  }
};

dealApi.deleteDeal = async (req, res) => {
  try {
    const dealToDelete = await Deal.findById(req.params.id);

    if (!dealToDelete) {
      res.status(404).json("Negócio não encontrado.");
    }

    if (dealToDelete.state == "Cancelado") {
      await dealToDelete.deleteOne();
      await Suggestion.deleteMany({ deal: dealToDelete._id });

      res.status(200).json("Negócio deletado com sucesso.");
    } else {
      res
        .status(400)
        .json("O Negócio precisa ser cancelado antes de ser deletado.");
    }
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);
    return res.status(500).json(error.name + " " + error.message);
  }
};

/**
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

    // if (updatedDeal.state === "Fechado" || updatedDeal.state === "Cancelado") {
    //   await Suggestion.deleteMany({ deal: dealId });
    // }

    return res.json("Informações do Negócio alteradas com Sucesso.");
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);

    if (error.name === "ValidationError") {
      const frontendError = error.message.split(":")[2].trim();
      return res.status(500).json(frontendError);
    }

    return res.status(500).json(error.name + " " + error.message);
  }
};

dealApi.suggestedDeals = async (req, res) => {
  try {
    const suggestedDeals = await Suggestion.find({ suggestedTo: req.user.id })
      .populate({
        path: "deal",
        match: { state: { $in: "Disponivel" } },
        populate: {
          path: "owner",
          select: "name profilePicture",
        },
      })
      .populate("suggestedBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    const availableSuggestions = suggestedDeals.filter(
      (suggestion) => suggestion.deal !== null,
    );

    if (!availableSuggestions || availableSuggestions.length === 0) {
      return res.status(200).json([]);
    }

    const currentUser = await Member.findById(req.user.id)
      .select("matchedDeals")
      .lean();

    const matchedDealsSet = new Set(
      currentUser?.matchedDeals?.map((id) => id.toString()) || [],
    );

    const formattedSuggestions = availableSuggestions.map((suggestion) => {
      if (suggestion.deal) {
        suggestion.deal.isMatched = matchedDealsSet.has(
          suggestion.deal._id.toString(),
        );
      }
      return suggestion;
    });

    return res.status(200).json(formattedSuggestions);
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);

    if (error.name === "ValidationError") {
      const frontendError = error.message.split(":")[2].trim();
      return res.status(500).json(frontendError);
    }

    return res.status(500).json(error.name + " " + error.message);
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

    return res.status(200).json();
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);

    if (error.name === "ValidationError") {
      const frontendError = error.message.split(":")[2].trim();
      return res.status(500).json(frontendError);
    }

    return res.status(500).json(error.name + " " + error.message);
  }
};

dealApi.rejectSuggestion = async (req, res) => {
  try {
    const suggestionId = req.params.id;

    await Suggestion.findByIdAndDelete(suggestionId);

    return res.json();
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);
    return res.status(500).json(error.name + " " + error.message);
  }
};

dealApi.match = async (req, res) => {
  try {
    const dealId = req.params.id;

    const member = await Member.findById(req.user.id);
    if (!member) {
      return res.status(404).json("Membro não encontrado.");
    }

    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json("Negócio não encontrado.");
    }

    const alreadyMatched = member.matchedDeals.some(
      (id) => id.toString() === dealId,
    );

    let isMatched = false;

    if (alreadyMatched) {
      await Member.findByIdAndUpdate(req.user.id, {
        $pull: { matchedDeals: dealId },
      });
      isMatched = false;
    } else {
      await Member.findByIdAndUpdate(req.user.id, {
        $addToSet: { matchedDeals: dealId },
      });
      isMatched = true;
    }

    return res.status(200).json({
      message: "Operação realizada com sucesso.",
      isMatched: isMatched,
    });
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);
    return res.status(500).json(error.name + " " + error.message);
  }
};

export { dealApi };
