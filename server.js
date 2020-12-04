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

  const insertQuery =    `INSERT INTO
  USU_T560 (
    usu_codemp,
    usu_numosv,
    usu_codusu,
    usu_datger,
    usu_codeqp,
    usu_deseqp,
    usu_tiposv
  )
VALUES
  (
    1,
    (
      SELECT
        MAX(usu_numosv) + 1
      from
        USU_T560
    ),
    :codUsu,  to_date(:datGer, 'dd/mm/yyyy')  ,:codEqp, :desEqp, :tipOsv
  )
`
  
  const params = {
  codUsu: req.params.codUsu,
  datGer: req.params.datGer,
  codEqp:  req.params.codEqp,
  desEqp: req.params.desEqp,
  tipOsv: req.params.tipOsv
}

dbConnectInsert(req, res, insertQuery,params.codUsu,params.datGer, params.codEqp, params.desEqp, params.tipOsv)

}


app.get("/", (req, res) => {
  res.send("Página inicial");
});

app.post('/api/newos/:codUsu/:datGer/:codEqp/:desEqp/:tipOsv', (req, res) => {

  req.params.datGer = req.params.datGer.replace(/-/g, '/').substr(0, 10).trim()
  //http://localhost:5000/api/newos/15/04Dec2020/105462/balanca/3
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
