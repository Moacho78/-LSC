require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", require("./routes/usuarioRoutes"));
app.use("/api/palabra",require("./routes/palabraRoutes"));

// ✅ Llamar la función directamente
connectDB();

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});