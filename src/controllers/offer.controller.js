import { Deal } from "../models/deal.model.js";

const INTERNAL_ERROR_MSG = "Internal Server Error";

const dealController = {};

dealController.createDeal = async (req, res) => {
  try {
    const { title, description, confidential, ownerId } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Todos as areas devem ser preenchidas." });
    }

    const newDeal = await Deal.create({
      title: title,
      description: description,
      confidential: confidential,
      ownerId: ownerId,
    });

    res.status(201).json({ mesage: "Oferta criada com sucesso." });
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

dealController.listDeals = async (req, res) => {
  try {
    const dealList = await Deal.find();

    res.status(200).json(dealList);
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

dealController.dealDetails = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(400).json({ message: "Oferta não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

dealController.updateDeal = async (req, res) => {
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

    res.status(200);
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

dealController.deleteDeal = async (req, res) => {
  try {
    const deleted = await Deal.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(400).json({
        message: "Oferta não encontrada.",
      });
    }

    res.status(200);
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

export { dealController as dealController };
