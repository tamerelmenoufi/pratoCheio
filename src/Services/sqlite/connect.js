import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase("db.db")
export default db


  db.transaction((tx) => {
      //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
      // tx.executeSql("DROP TABLE restaurante;");
      //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS restaurante (codigo INTEGER PRIMARY KEY AUTOINCREMENT, restaurante INTEGER, titulo TEXT, local TEXT);"
      );
      // tx.executeSql(`REPLACE INTO restaurante (codigo, restaurante, titulo, local) VALUES ('1','','','')`)


    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
    // tx.executeSql("DROP TABLE usuarios;");
    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>

    tx.executeSql(
        "CREATE TABLE IF NOT EXISTS usuarios "+
        "("+
        " codigo INTEGER PRIMARY KEY AUTOINCREMENT,"+
        " nome TEXT,"+
        " cpf TEXT,"+
        " telefone TEXT,"+
        " restaurante INTEGER,"+
        " titulo TEXT,"+
        " local TEXT,"+
        " endereco TEXT," +
        " data TEXT," +
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

  });


