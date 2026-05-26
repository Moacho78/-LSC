const mongoose = require("mongoose");

// 🔹 Subdocumento para registros
const RegistroSchema = new mongoose.Schema({
  palabra: {
    type:String,
    required: true
  },
  puntaje: {
    type: Number,
    required: true,
    min: 0
  },
  respuestas: [{
    type: String
  }],
  fecha: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true, //  no repetir correos
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // formato válido
      "Correo no válido"
    ]
  },
  password: {
    type: String,
    required: true,
    minlength: 8 // mínimo estándar
  },
    departamento: {
    type: String,
    required: true,
    trim: true
  },
  registros: {
    type: [RegistroSchema],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Usuario", UsuarioSchema);