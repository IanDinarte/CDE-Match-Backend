import { User } from "../models/user.model.js";

const INTERNAL_ERROR_MSG = "Internal Server Error";

const memberController = {};

memberController.listMembers = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.newMember = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Todos as areas devem ser preenchidas." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Utilizador já está registado no sistema." });
    }

    const user = await User.create({
      email: email.toLowerCase,
      password: password,
    });

    res.status(201).json({ message: "Utilizador registado com sucesso." });
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    const isMatch = await user.comparePassword(password);

    // if (!user) {
    //   return res.status(400).json({ message: "Email incorreto." });
    // }

    if (!isMatch || !user) {
      return res.status(400).json({ message: "Email ou Senha incorretos." });
    }

    res.status(200).json({
      message: "Login Succesful",
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    res.satus(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.logout = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Utilizador não encontrado." });
    }

    res.status(200).json({ message: "Logout feito com sucesso" });
  } catch (error) {
    res.satus(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.profile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, {
      password: 0,
      phone: 0,
      email: 0,
    });

    if (!user) {
      return res.status(400).json({ message: "Utilizador não encontrado." });
    }

    res.status(200).json({ message: "Utilizador encontrado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

memberController.editProfile = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400);
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!user) {
      return res.status(400).json({
        message: "Utilizador não encontrado.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG });
  }
};

memberController.deleteProfile = async (req, res) => {
  try {
    const id = req.body;

    User.findByIdAndDelete(id).exec();

    res.status(200).json({ message: "Perfil excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

export { memberController };
