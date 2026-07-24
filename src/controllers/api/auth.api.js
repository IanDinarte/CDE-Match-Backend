import { Member } from "../../models/member.model.js";
import jwt from "jsonwebtoken";
import { AccountCode } from "../../models/accountCode.model.js";
import { sendResetPasswordEmail } from "../../config/mailer.js";

const INTERNAL_ERROR_MSG = "Internal Server Error";
const authApi = {};

authApi.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const member = await Member.findOne({ "email.value": email });

    if (
      !member ||
      !(await member.comparePassword(password)) ||
      member.state === "Inativo"
    ) {
      return res.status(400).json("Credenciais inválidas.");
    }

    const token = jwt.sign(
      { id: member.id, role: "member" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json(token);
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);
    return res.status(500).json(error.name + " " + error.message);
  }
};

authApi.resetPassword = async (req, res) => {
  try {
    const email = req.body.email;

    const member = await Member.findOne({ "email.value": email });
    if (!member) {
      return res.send({
        success: false,
        message: "Se o membro existe, um email foi enviado.",
      });
    }

    let accCode = await AccountCode.findOne({ member: member._id });
    if (!accCode) {
      accCode = new AccountCode({
        member: member._id,
        email: member.email,
      });
    }

    const token = await generateCode(5);
    accCode.resetToken = token;
    accCode.resetTokenExpiration = Date.now() + 3600000;
    accCode.valid = true;
    await accCode.save();
    await sendResetPasswordEmail(email, token);

    return res.send({ success: true, message: "Email sent" });
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);
    return res.status(500).json(error.name + " " + error.message);
  }
};

authApi.changePassword = async (req, res) => {
  try {
    const email = req.body.email;
    const member = await Member.findOne({ "email.value": email });
    if (!member) {
      return res.status(400).json("Se o membro existe, um email foi enviado.");
    }

    const code = req.body.code;

    let accCode = await AccountCode.findOne({ member: member._id });
    if (
      !accCode ||
      Date.now() > accCode.resetTokenExpiration ||
      accCode.resetToken != code ||
      accCode.valid == false
    ) {
      return res.status(400).json("Código Incorreto ou Expirado.");
    }

    const password = req.body.password;
    const isSameAsOld = await member.comparePassword(password);
    if (isSameAsOld) {
      return res
        .status(400)
        .json("A nova senha não pode ser igual à senha atual.");
    }
    member.password = password;

    await member.save();

    accCode.valid = false;
    await accCode.save();

    return res.status(200).json("Senha atualizada com sucesso.");
  } catch (error) {
    console.log(INTERNAL_ERROR_MSG + " " + error.message);
    return res.status(500).json(error.name + " " + error.message);
  }
};

async function generateCode(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export { authApi };
