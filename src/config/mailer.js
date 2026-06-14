// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendMemberWelcomeEmail = async (
//   memberEmail,
//   memberName,
//   password,
// ) => {
//   try {
//     const data = await resend.emails.send({
//       from: "CDE Match Team <onboarding@resend.dev>",
//       to: memberEmail,
//       subject: "Bem-vindo à comunidade CDE Match",
//       html: `
//         <h1>Olá, ${memberName}!</h1>
//         <p>A tua conta de membro foi criada com sucesso.</p>
//         <p><strong>Informações de Acesso:</strong></p>
//         <ul>
//           <li><strong>Email:</strong> ${memberEmail}</li>
//           <li><strong>Password Temporária:</strong> ${password}</li>
//         </ul>
//       `,
//     });

//     console.log("Email enviado pelo Resend:", data);
//     return data;
//   } catch (error) {
//     console.error("Erro no Resend:", error);
//     throw error;
//   }
// };

// export const sendAdminWelcomeEmail = async (
//   adminEmail,
//   adminName,
//   password,
// ) => {
//   try {
//     const data = await resend.emails.send({
//       from: '"CDE Match Team" <onboarding@resend.pt>',
//       to: adminEmail,
//       subject: "Bem-vindo à Equipa de Administração - CDE Match",
//       html: `
//       <h1>Olá, ${adminName}!</h1>
//       <p>A tua conta de administrador foi criada com sucesso.</p>
//       <p><strong>Informações de Acesso:</strong></p>
//       <ul>
//         <li><strong>URL:</strong> https://cde-match-backend.onrender.com/</li>
//         <li><strong>Email:</strong> ${adminEmail}</li>
//         <li><strong>Password Temporária:</strong> ${password}</li>
//       </ul>
//       <p>Por segurança, recomendamos que alteres a tua password após o primeiro login.</p>
//     `,
//     });
//     console.log("Email enviado pelo Resend:", data);
//     return data;
//   } catch (error) {
//     console.error("Erro no Resend:", error);
//     throw error;
//   }
// };
