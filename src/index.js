const express = require("express");
require('dotenv').config()
const router = require("./routes/Router");

const app = express();
app.use(express.json());

app.use(router);

app.listen(8080, () => {
  console.log("Servidor rodando na porta 8080");
});
