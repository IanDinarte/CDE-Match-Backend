import { Deal } from "../models/deal.model.js";
import { Member } from "../models/member.model.js";

const INTERNAL_ERROR_MSG = "Internal Server Error";

const dealController = {};

dealController.listDeals = async (req, res) => {
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

    const deals = (await Deal.find(searchOptions)) || [];

    res.render("admin/deal/index", {
      deals: deals,
      searchOptions: req.query,
    });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

dealController.newDealPage = async (req, res) => {
  try {
    const areas = Deal.schema.path("area").enumValues;
    const members = await Member.find();
    res.render("admin/deal/new", {
      deal: new Deal(),
      members: members,
      areas: areas,
    });
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

dealController.newDeal = async (req, res) => {
  try {
    const newDeal = await Deal.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      owner: req.body.owner,
      type: req.body.type,
      area: req.body.area,
      confidential: req.body.confidential,
      state: req.body.state,
    });

    await newDeal.save();

    await Member.findByIdAndUpdate(req.body.owner, {
      $push: { deals: newDeal._id },
    });

    res.redirect(`${newDeal._id}`);
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

dealController.dealDetails = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    await deal.populate("owner");

    if (!deal) {
      return res.status(400).json({ message: "Negócio não encontrado." });
    }

    res.render("admin/deal/show", { deal: deal });
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

dealController.editDealPage = async (req, res) => {
  try {
    const areas = Deal.schema.path("area").enumValues;
    const deal = await Deal.findById(req.params.id);
    await deal.populate("owner");
    const members = await Member.find();

    res.render("admin/deal/edit", {
      deal: deal,
      members: members,
      areas: areas,
    });
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

dealController.editDeal = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400);
    }

    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!deal) {
      return res.status(400).json({
        message: "Oferta não encontrada.",
      });
    }

    res.redirect(`${deal._id}`);
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

dealController.deleteDeal = async (req, res) => {
  try {
    const dealToDelete = await Deal.findById(req.params.id);

    if (dealToDelete.state == "Cancelado") {
      await dealToDelete.deleteOne();
      res.redirect("/admin/manage-deals/");
    } else {
      //mensagem pop up
      res.redirect(`/admin/manage-deals/${dealToDelete._id}`);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

export { dealController };
