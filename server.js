const express = require("express");
const app = express();
const port = 5000;


const {dbConnectSelect, dbConnectInsert} = require('./database')




const selectAllOS = (req, res) => {
  const selectAll =  `select usu_numosv,usu_codeqp ,usu_deseqp from usu_t560`

  dbConnectSelect(req, res, selectAll)

}

const selectEqpByCode = (req, res) => {
  const selectQuery = `select usu_numosv,usu_codeqp ,usu_deseqp from usu_t560 WHERE usu_codEqp = :codEqp`
  const params = req.params.codEqp

  dbConnectSelect(req, res, selectQuery, params)

}

const selectAllEqpNamesAndCode = (req, res) => {
  const selectAll =  `select codeqp, deseqp from e103eqp`

  dbConnectSelect(req, res, selectAll)

}

const selectAllUsers = (req, res) => {
  const selectUsers = `select usu_nomusu, usu_codusu from usu_t522 ORDER BY 1`;
  dbConnectSelect(req, res, selectUsers)
}

const insertNewOS = (req, res) => {
  const insertQuery =  `INSERT INTO usu_t560 (usu_codemp, usu_numosv, usu_codeqp, usu_deseqp) VALUES (:codEmp, (select MAX(usu_numosv) + 1 from usu_t560), :codEqp, :desEqp)`
  
  const params = {
  codEmp: req.params.codEmp,
  codEqp:  req.params.codEqp,
  desEqp: req.params.desEqp
}

dbConnectInsert(req, res, insertQuery, params.codEmp, params.codEqp, params.desEqp)

}


app.get("/", (req, res) => {
  res.send("Página inicial");
});

app.get('/api/newos/:codEmp/:codEqp/:desEqp', (req, res) => {
  //http://localhost:5000/api/newos/23/50/rosca
  insertNewOS(req, res)
})

app.get("/api/os", (req, res) => {
  selectAllOS(req, res)
});

app.get("/api/os/:codEqp", (req, res) => {
  selectEqpByCode(req, res)
});

app.get('/api/allEqps', (req, res) => {
  selectAllEqpNamesAndCode(req, res)
})

app.get('/api/allUsers', (req, res) => {
  selectAllUsers(req, res)
})

app.listen(port, () => console.log("Servidor rodando na porta: ", port));
