import { Offer } from "../models/offer.model.js";

const INTERNAL_ERROR_MSG = "Internal Server Error";

const offerController = {};

offerController.createOffer = async (req, res) => {
  try {
    const { title, description, confidential, ownerId } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Todos as areas devem ser preenchidas." });
    }

    const newOffer = await Offer.create({
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

offerController.listOffers = async (req, res) => {
  try {
    const offerList = await Offer.find();

    res.status(200).json(offerList);
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

offerController.offerDetails = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(400).json({ message: "Oferta não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

offerController.updateOffer = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400);
    }

    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!offer) {
      return res.status(400).json({
        message: "Oferta não encontrada.",
      });
    }

    res.status(200);
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

offerController.deleteOffer = async (req, res) => {
  try {
    const deleted = await Offer.findByIdAndDelete(req.params.id);

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

export { offerController };
