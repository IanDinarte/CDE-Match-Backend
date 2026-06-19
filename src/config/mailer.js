import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  // host: "smtp.gmail.com",
  host: 'mail.cdematch.pt',
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
        <li><strong>URL:</strong> http://cdematch.pt/api/auth/login</li>
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
        <li><strong>URL:</strong> link do web frontend e link para instalar o apk</li>
        <li><strong>Email:</strong> ${memberEmail}</li>
        <li><strong>Password Temporária:</strong> ${password}</li>
      </ul>
      <p>Por segurança, recomendamos que alteres a tua password após o primeiro login.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};
