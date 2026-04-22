const express = require("express");
const cors = require("cors");
const routes = require("./routes/index");

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
