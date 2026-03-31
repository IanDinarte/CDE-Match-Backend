// imports
import express from "express"
import expressEjsLayouts from "express-ejs-layouts";
import * as path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;

// routes import
import indexRouter from './src/routes/index.route.js'
import userRouter from './src/routes/user.route.js'
import offerRouter from './src/routes/offer.route.js'

app.set('view engine', 'ejs');
app.set('views', './src/views'); // Define onde as páginas ficarão
app.set('layout', 'layout.ejs')
app.use(expressEjsLayouts)
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use("/", indexRouter); //raiz da app
app.use("/user", userRouter);
app.use("/offer", offerRouter);

// iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

export default app