const express = require("express");
const router = express.Router();

const {
    getPalabraInfo,
    getEvaluacion
} = require("../controllers/palabraController");

const validarJWT = require("../middlewares/authMiddleware");

// 🔒 aplicar middleware

// info de la seña
router.get("/palabras/:id", validarJWT, getPalabraInfo);

// evaluación
router.get("/palabras/:id/evaluacion", validarJWT, getEvaluacion);

module.exports = router; 