const mongoose = require("mongoose");

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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Usuario", UsuarioSchema);