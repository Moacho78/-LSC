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

//const RetroalimentacionSchema = new mongoose.Schema({
    //error: {
       // type: String,
       // required: true,
       // trim: true
    //},
    //mensaje: {
        //type: String,
        //required: true,
        //trim: true
   // }
//}, { _id: false });

const PalabraSchema = new mongoose.Schema({
    palabra: {
        type: String,
        required: true,
        trim: true
    },

    nivel: {
        type: String,
        required: true,
        enum: ["basico", "intermedio", "avanzado"], //control de valores
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

    tolerancia: {
        movimiento: {
            type: Number,
            required: true,
            min: 0,
            max: 1
        },
        posicion: {
            type: Number,
            required: true,
            min: 0,
            max: 1
        }
    },

    video_referencia: {
        type: String,
        trim: true
    },


}, {
    timestamps: true
});

module.exports = mongoose.model("Palabra", PalabraSchema);