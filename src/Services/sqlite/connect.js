import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase("db.db")
export default db


let dataEnvio = new Date();
let dataFormatada = dataEnvio.getFullYear() +
                    "-" +
                    ((dataEnvio.getMonth() + 1)) +
                    "-" +
                    (dataEnvio.getDate())


  db.transaction((tx) => {
      //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
      // tx.executeSql("DROP TABLE restaurante;");
      //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
      tx.executeSql("CREATE TABLE IF NOT EXISTS restaurante (codigo INTEGER PRIMARY KEY AUTOINCREMENT, restaurante INTEGER, titulo TEXT, local TEXT);");
      // tx.executeSql(`REPLACE INTO restaurante (codigo, restaurante, titulo, local) VALUES ('1','','','')`)

    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
    // tx.executeSql("DROP TABLE usuarios;");
    // console.warn(`DELETE FROM usuarios WHERE data NOT LIKE '%${dataFormatada}%' AND upload = 's'`)

    tx.executeSql(
        "CREATE TABLE IF NOT EXISTS usuarios "+
        "("+
        " codigo INTEGER PRIMARY KEY AUTOINCREMENT,"+
        " nome TEXT,"+
        " cpf TEXT NOT NULL UNIQUE,"+
        " telefone TEXT,"+
        " restaurante INTEGER,"+
        " titulo TEXT,"+
        " local TEXT,"+
        " endereco TEXT," +
        " data TEXT," +
        " origem TEXT," +
        " upload VARCHAR(2)"+
        ");"
    );


    // usuario, voto, data, upload


    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
    // tx.executeSql("DROP TABLE votos;");
    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS votos "+
      "("+
      " codigo INTEGER PRIMARY KEY AUTOINCREMENT,"+
      " restaurante INTEGER,"+
      " usuario INTEGER,"+
      " voto TEXT,"+
      " data TEXT," +
      " upload VARCHAR(2)"+
      ");"
  );

    // tx.executeSql(`DELETE FROM usuarios WHERE data NOT LIKE '%${dataFormatada}%' AND upload = 's';`)
    tx.executeSql(`DELETE FROM votos WHERE data NOT LIKE '%${dataFormatada}%' AND upload = 's';`)
    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>

  });


