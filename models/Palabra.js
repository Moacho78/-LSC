const mongoose = require("mongoose");

const RasgoSchema = new mongoose.Schema({
    rasgo_id: {
        type: String,
        required: true,
        trim: true
    },
    obligatorio: {
        type: Boolean,
        required: true
    }
}, { _id: false });

// 🔹 Subesquema para preguntas
const PreguntaSchema = new mongoose.Schema({
    enunciado: {
        type: String,
        required: true,
        trim: true
    },
    opciones: {
        type: [String],
        required: true,
        validate: [arr => arr.length >= 2, "Debe tener al menos 2 opciones"]
    },
    respuesta_correcta: {
        type: Number, // índice de la opción correcta
        required: true
    }
}, { _id: false });

const PalabraSchema = new mongoose.Schema({
    palabra: {
        type: String,
        required: true,
        trim: true
    },

    nivel: {
        type: String,
        required: true,
        enum: ["basico", "intermedio", "avanzado"],
        lowercase: true,
        trim: true
    },

    rasgos: {
        manuales: {
            type: [RasgoSchema],
            default: []
        },
        no_manuales: {
            type: [RasgoSchema],
            default: []
        }
    },

    video_referencia: {
        type: String,
        trim: true
    },

    // 🔹 NUEVO BLOQUE DE EVALUACIÓN
    evaluacion: {
        preguntas: {
            type: [PreguntaSchema],
            validate: [
                arr => arr.length === 5,
                "La evaluación debe tener exactamente 5 preguntas"
            ]
        }
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Palabra", PalabraSchema, "Palabra");