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

const selectAllUsers = async (req, res) => {
  const selectUsers = `select usu_nomusu, usu_codusu from usu_t522 ORDER BY 1`;
  const result = await dbConnectSelect(req, res, selectUsers)
  return result
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





const selectLastItem = async (req, res) => {

  const query = `SELECT usu_deseqp, usu_datger, usu_desanm from USU_T560 where usu_numosv = (SELECT
    MAX(usu_numosv)
  from
    USU_T560)`
  
    const result = await dbConnectSelect(req, res, query)
    return result
  }

app.get("/", (req, res) => {
  res.send("Página inicial | API Oracle");
});

app.post('/api/newos/:codUsu/:codEqp/:desEqp/:tipOsv/:desAnm', (req, res) => {
  insertNewOS(req, res)
})

app.get("/api/os",  (req, res) => {

selectAllOS(req, res)

});

app.get("/api/os/:codEqp",  (req, res) => {
selectEqpByCode(req, res)

});

app.get('/api/allEqps',  (req, res) => {
selectAllEqpNamesAndCode(req, res)

})

app.get('/api/allUsers',  async (req, res) => {
  const data = await selectAllUsers(req, res)

  const rows = data.rows

  let response = []
  for (let i of rows) {

    response.push({
      name: i[0],
      cod: i[1]
    })
  }
  res.json(response)
})

app.get('/api/lastos', async (req, res) => {
  const data = await selectLastItem(req, res)



  const rows = data.rows
  const unformattedDate = rows[0][1].toLocaleString().slice(0, 10).split("-")
  const dateText = unformattedDate[2] + "/" + unformattedDate[1] + "/" + unformattedDate[0];

  const response = {
    nameEqp: rows[0][0],
    date: dateText,
    anomaly: rows[0][2]
  }

  res.send(response)
})

app.get('/api/checkdb', (req, res) => {
  res.json({
    ok: true
  })
})

app.listen(port, '0.0.0.0', () => console.log("Servidor rodando na porta: ", port));