import express from "express"

const app = express();
const port = 3000;

//routes import
import userRouter from './src/routes/user.route.js'
import offerRouter from './src/routes/offer.route.js'

app.use("/user", userRouter);
app.use("/offer", offerRouter);

// Rota principal
app.get('/', (req, res) => {
  res.send('Olá! Meu backend em Node.js está rodando! 🚀');
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

export default app