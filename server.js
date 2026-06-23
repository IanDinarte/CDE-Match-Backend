// imports
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import "dotenv/config";
import { connectDB } from "./src/config/database.js";
import { authController } from "./src/controllers/auth.controller.js";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import cors from "cors";
import seedDefaultAdmin from "./src/config/setupAdmin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./src/views");
app.set("layout", "layout.ejs");
app.use(expressEjsLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(cors());
app.use(authController.setUser);

// routes import
import indexRouter from "./src/routes/index.router.js";
import adminRouter from "./src/routes/admin/admin.router.js";
import authRouter from "./src/routes/auth.router.js";
import apiRouter from "./src/routes/api/api.router.js";

// routes
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/admin", authController.verifyLogin, adminRouter);
app.use("/api", apiRouter);

connectDB()
  .then(async () => {
    await seedDefaultAdmin();

    app.listen(port, () => {
      console.log(`Servidor a rodar na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error("ERRO na conexão com MongoDB:", err);
  });

export default app;
