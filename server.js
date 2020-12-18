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
    usu_tiposv,
    usu_desanm
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
    :codUsu,  SYSDATE  ,:codEqp, :desEqp, :tipOsv, :usu_desanm
  )
`
  
  const params = {
  codUsu: req.params.codUsu,
  codEqp:  req.params.codEqp,
  desEqp: req.params.desEqp,
  tipOsv: req.params.tipOsv,
  desAnm: req.params.desAnm
}

dbConnectInsert(req, res, insertQuery,params.codUsu, params.codEqp, params.desEqp, params.tipOsv, params.desAnm)

}


app.get("/", (req, res) => {
  res.send("Página inicial | API Oracle");
});

app.post('/api/newos/:codUsu/:codEqp/:desEqp/:tipOsv/:desAnm', (req, res) => {
  insertNewOS(req, res)
})

app.get("/api/os", (req, res) => {
  console.log('docker')
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

app.get('/api/checkdb', (req, res) => {
  res.json({
    ok: true
  })
})

app.listen(port, '0.0.0.0', () => console.log("Servidor rodando na porta: ", port));
