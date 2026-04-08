// imports
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import "dotenv/config";
import { connectDB } from "./src/config/database.js";
import methodOverride from 'method-override';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;

// routes import
import indexRouter from "./src/routes/index.router.js";
import adminRouter from "./src/routes/admin.router.js";

app.set("view engine", "ejs");
app.set("views", "./src/views"); // Define onde as páginas ficarão
app.set("layout", "layout.ejs");
app.use(expressEjsLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));

// routes
app.use("/", indexRouter); //raiz da app
app.use("/admin", adminRouter);


connectDB()
  .then(() => {
    // Só inicia o servidor se o banco conectar com sucesso
    app.listen(port, () => {
      console.log(`⚙️  Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("ERRO na conexão com MongoDB:", err);
  });

// iniciando o servidor
// app.listen(port, () => {
//   console.log(`Servidor rodando em http://localhost:${port}`);
// });

export default app;
