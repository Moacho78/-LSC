const express = require("express");
const router = express.Router();
const controller = require("../controllers/usuarioController");
const validarJWT = require("../middlewares/authMiddleware");


router.post("/registro", controller.registro);
router.post("/login", controller.login);

// 🔹 POST -> Agregar registro
router.post("/:id/registros",validarJWT, controller.agregarRegistro);
// 🔹 GET -> Obtener registros
router.get("/:id/registros",validarJWT, controller.obtenerRegistros);


module.exports = router;