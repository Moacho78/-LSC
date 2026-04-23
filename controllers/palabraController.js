const Palabra = require("../models/Palabra");

// GET /palabras/:id
const getPalabraInfo = async (req, res) => {
    try {
        const { id } = req.params;

        const palabra = await Palabra.findOne({ _id: id })
            .select("-evaluacion") // 🔥 excluye evaluación
            .lean();

        if (!palabra) {
            return res.status(404).json({
                ok: false,
                msg: "Palabra no encontrada"
            });
        }

        res.json({
            ok: true,
            data: palabra
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al obtener la palabra",
            error: error.message
        });
    }
};

// GET /palabras/:id/evaluacion
const getEvaluacion = async (req, res) => {
    try {
        const { id } = req.params;

        const palabra = await Palabra.findById(id)
            .select("evaluacion") // 🔥 solo evaluación
            .lean();

        if (!palabra) {
            return res.status(404).json({
                ok: false,
                msg: "Palabra no encontrada"
            });
        }

        res.json({
            ok: true,
            data: palabra.evaluacion
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al obtener la evaluación",
            error: error.message
        });
    }
};

// GET /palabras
const getPalabras = async (req, res) => {
    try {
        const palabras = await Palabra.find({})
            .select("_id palabra") // 🔥 solo trae id y nombre
            .lean();

        res.json({
            ok: true,
            total: palabras.length,
            data: palabras
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al obtener las palabras",
            error: error.message
        });
    }
};

module.exports = {
    getPalabraInfo,
    getEvaluacion,
    getPalabras
};