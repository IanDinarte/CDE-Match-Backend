import nodemailer from "nodemailer";

const BACKEND_URL = "https://cdematch.alwaysdata.net/";
const FRONTEND_WEB_URL = "https://www.vanytime.pt/cdematch.pt/app/";
const FRONTEND_APK_URL =
  "https://expo.dev/accounts/clube_do_empreendedor/projects/CDEMatch/builds/3bdd5bbd-2dd1-4fa2-ae6f-215d7acda5b6";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  // host: "mail.cdematch.pt",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Erro na ligação ao Email:", error);
  } else {
    console.log("Ligação de Email pronta.");
  }
});

export const sendAdminWelcomeEmail = async (
  adminEmail,
  adminName,
  password,
) => {
  const mailOptions = {
    from: `"Equipa CDE Match" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: "Bem-vindo à Equipa de Administração - CDE Match",
    html: `
      <h1>Olá, ${adminName}!</h1>
      <p>A tua conta de administrador foi criada com sucesso.</p>
      <p><strong>Informações de Acesso:</strong></p>
      <ul>
        <li><a href="${BACKEND_URL}"><strong> Link de Acesso </strong></a></li> 
        <li><strong>Email:</strong> ${adminEmail}</li>
        <li><strong>Password Temporária:</strong> ${password}</li>
      </ul>
      <p>Por segurança, recomendamos que alteres a tua password após o primeiro login.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendMemberWelcomeEmail = async (
  memberEmail,
  memberName,
  password,
) => {
  const mailOptions = {
    from: `"Equipa CDE Match" <${process.env.EMAIL_USER}>`,
    to: memberEmail,
    subject: "Bem-vindo à comunidade CDE Match",
    html: `
      <h1>Olá, ${memberName}!</h1>
      <p>A tua conta de membro foi criada com sucesso.</p>
      <p><strong>Informações de Acesso:</strong></p>
      <ul>
        <li><strong>Email:</strong> ${memberEmail}</li>
        <li><strong>Password Temporária:</strong> ${password}</li>
      </ul>
      <strong>Como instalar:</strong>
      <ul>
        <li><strong>IPhone/IOS:</strong> <a${FRONTEND_WEB_URL}> Apenas acesse esse link </a></li>
        <li><strong>Android:</strong>
          <ul>
            <li>
              <a href="${FRONTEND_APK_URL}"> Acesse esse link e clique em "Instalar" </a>
            </li>
            <li>
              <strong>
                Caso a instação seja bloqueada, clique em "Mais detalhes" e em seguida em "Instalar mesmo assim".
              </strong>
            </li>
          </ul>
        </li>
      </ul>
      <p>Por segurança, recomendamos que alteres a tua password após o primeiro login.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};
