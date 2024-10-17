// database/connection.js
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // Altere conforme suas credenciais do MySQL
  password: "12345678", // Altere conforme suas credenciais do MySQL
  database: "mytask",
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL.");
});

module.exports = connection;
