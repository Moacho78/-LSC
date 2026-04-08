const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ msg: "No hay token, acceso denegado" });
    }

    // Formato: "Bearer token"
    const tokenLimpio = token.replace("Bearer ", "");

    const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET);

    req.usuario = decoded;
    next();

  } catch (error) {
    return res.status(401).json({ msg: "Token inválido" });
  }
};

module.exports = verificarToken;