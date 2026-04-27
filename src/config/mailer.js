import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  }
});

export const sendAdminWelcomeEmail = async (adminEmail, adminName, password) => {
  const mailOptions = {
    from: '"CDE Match Team" <no-reply@cdematch.pt>',
    to: adminEmail,
    subject: 'Bem-vindo à Equipa de Administração - CDE Match',
    html: `
      <h1>Olá, ${adminName}!</h1>
      <p>A tua conta de administrador foi criada com sucesso.</p>
      <p><strong>Informações de Acesso:</strong></p>
      <ul>
        <li><strong>URL:</strong> http://localhost:3000/auth/login</li>
        <li><strong>Email:</strong> ${adminEmail}</li>
        <li><strong>Password Temporária:</strong> ${password}</li>
      </ul>
      <p>Por segurança, recomendamos que alteres a tua password após o primeiro login.</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

export const sendMemberWelcomeEmail = async (memberEmail, memberName, password) => {
  const mailOptions = {
    from: '"CDE Match Team" <no-reply@cdematch.pt>',
    to: memberEmail,
    subject: 'Bem-vindo à comunidade CDE Match',
    html: `
      <h1>Olá, ${memberName}!</h1>
      <p>A tua conta de membro foi criada com sucesso.</p>
      <p><strong>Informações de Acesso:</strong></p>
      <ul>
        <li><strong>URL:</strong> link do login frontend</li>
        <li><strong>Email:</strong> ${memberEmail}</li>
        <li><strong>Password Temporária:</strong> ${password}</li>
      </ul>
      <p>Por segurança, recomendamos que alteres a tua password após o primeiro login.</p>
    `
  };

  return transporter.sendMail(mailOptions);
};