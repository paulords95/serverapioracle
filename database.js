const oracledb = require("oracledb");

require('dotenv').config()


const user = process.env.USER;
const password = process.env.PASSWORD;
const connectString = process.env.CONNECTIONSTRING;


const dbConnectSelect = async (req, res, query, ...parameters) => {
    try {
      connection = await oracledb.getConnection({
        user,
        password,
        connectString,
      });
  
      console.log("Conectado a base");
      result = await connection.execute(
       query, [...parameters],
      );
    } catch (err) {
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.close();
          console.log("Conexão fechada");
        } catch (err) {
          console.error(err.message);
        }
      }
      if (result.rows.length == 0) {
        return res.send("query não retornou nada");
      } else {
        return res.json({
          data: result
        });
      }
    }
  }


const dbConnectInsert = async (req, res, query, ...parameters) => {
  try {
    connection = await oracledb.getConnection({
      user,
      password,
      connectString,
    });

    console.log("Conectado a base");
    result = await connection.execute(
     query, [...parameters], {autoCommit: true}
    );
    return res.send('Registro Gravado')
  } catch (err) {
    console.log(err)
    return res.send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("Conexão fechada");
        
      } catch (err) {
        console.error(err.message);
      }
    }
  
  }
}



exports.dbConnectSelect = dbConnectSelect
exports.dbConnectInsert = dbConnectInsert
