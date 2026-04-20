const mongoose = require("mongoose");

let connection = null;

const connectDB = async () => {
  if (connection) return connection;

  connection = await mongoose.connect("mongodb+srv://moacho:miguel746@cluster0.r6ck0hc.mongodb.net/Lsc");
  console.log("MongoDB conectado");
  //console.log("DB actual:", mongoose.connection.name);
  return connection;
};

module.exports = connectDB;