// index.js
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const connection = require("./database/connection");

const app = express();

// Configurações
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rota principal - listar tarefas
app.get("/", (req, res) => {
  connection.query("SELECT * FROM tarefa", (err, rows) => {
    if (err) throw err;
    res.render("index", { tarefas: rows });
  });
});

// Rota de criação de nova tarefa
app.get("/create", (req, res) => {
  res.render("create");
});

// Rota de edição de tarefa
app.get("/edit/:id", (req, res) => {
  const tarefa_id = req.params.id;
  connection.query(
    "SELECT * FROM tarefa WHERE tarefa_id = ?",
    [tarefa_id],
    (err, rows) => {
      if (err) throw err;
      res.render("edit", { tarefa: rows[0] });
    }
  );
});

app.post("/edit/:id", (req, res) => {
  const tarefa_id = req.params.id;
  const { titulo, descricao } = req.body;
  connection.query(
    "UPDATE tarefa SET titulo = ?, descricao = ? WHERE tarefa_id = ?",
    [titulo, descricao, tarefa_id],
    (err) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

// Rota de exclusão de tarefa
app.get("/delete/:id", (req, res) => {
  const tarefa_id = req.params.id;
  connection.query(
    "DELETE FROM tarefa WHERE tarefa_id = ?",
    [tarefa_id],
    (err) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

// Inicializando o servidor
app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});

app.post("/create", (req, res) => {
  const { titulo, descricao, data_finalizacao } = req.body;
  const data_criacao = new Date();

  // Verificar se o campo `data_finalizacao` foi preenchido
  const finalizacao = data_finalizacao ? new Date(data_finalizacao) : null;

  connection.query(
    "INSERT INTO tarefa (titulo, descricao, data_criacao, data_finalizacao) VALUES (?, ?, ?, ?)",
    [titulo, descricao, data_criacao, finalizacao],
    (err) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

app.post("/finalizar/:id", (req, res) => {
  const tarefaId = req.params.id;
  const dataFinalizacao = new Date();

  connection.query(
    "UPDATE tarefa SET data_finalizacao = ? WHERE tarefa_id = ?",
    [dataFinalizacao, tarefaId],
    (err) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

app.post("/finalizar/:id", (req, res) => {
  const tarefaId = req.params.id;

  // Se o checkbox estiver marcado, atualizamos a data_finalizacao
  if (req.body.finalizar) {
    const dataFinalizacao = new Date();
    connection.query(
      "UPDATE tarefa SET data_finalizacao = ? WHERE tarefa_id = ?",
      [dataFinalizacao, tarefaId],
      (err) => {
        if (err) throw err;
        res.redirect("/");
      }
    );
  } else {
    // Se o checkbox foi desmarcado, removemos a data_finalizacao
    connection.query(
      "UPDATE tarefa SET data_finalizacao = NULL WHERE tarefa_id = ?",
      [tarefaId],
      (err) => {
        if (err) throw err;
        res.redirect("/");
      }
    );
  }
});
