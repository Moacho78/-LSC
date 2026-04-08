const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔐 Validar contraseña segura
const validarPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
};

// 🟢 REGISTRO
exports.registro = async (req, res) => {
  try {
    const { nombre, email, password,departamento } = req.body;

    // Validar contraseña
    if (!validarPassword(password)) {
      return res.status(400).json({
        msg: "La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo"
      });
    }

    // Verificar si el correo ya existe
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHash,
      departamento
    });

    await nuevoUsuario.save();

    res.status(201).json({
      msg: "Usuario registrado correctamente"
    });

  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};


// 🔵 LOGIN con JWT
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "Credenciales inválidas" });
    }

    // Comparar contraseña
    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) {
      return res.status(400).json({ msg: "Credenciales inválidas" });
    }

    // 🔐 Generar token
    const payload = {
      id: usuario._id,
      email: usuario.email
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      msg: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {
  console.error(error); // 🔥 esto muestra el error real en consola

  res.status(500).json({
    msg: "Error en el servidor",
    error: error.message // ✅ ahora sí verás el mensaje
  });
}
};