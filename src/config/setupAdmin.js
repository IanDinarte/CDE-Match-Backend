import { Admin } from '../models/admin.model.js';
import bcrypt from "bcrypt";

const DEFAULT_NAME = "Administração";
const DEFAULT_EMAIL = "admin@admin.com";
const DEFAULT_PASSWORD = "Admin1!";

const seedDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      console.log('Nenhum administrador encontrado. Criando Administrador Default...');

      const superAdmin = new Admin({
        name: DEFAULT_NAME,
        email: DEFAULT_EMAIL,
        password: DEFAULT_PASSWORD,
      });

      await superAdmin.save();
      console.log('--------------------------------------');
      console.log('DEFAULT ADMIN CRIADO COM SUCESSO');
      console.log('Email: ' + DEFAULT_EMAIL);
      console.log('Password: ' + DEFAULT_PASSWORD);
      console.log('--------------------------------------');
    }
  } catch (error) {
    console.error('Erro ao verificar/criar default admin:', error.message);
  }
};

export default seedDefaultAdmin;