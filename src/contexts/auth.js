import React, {createContext, useState, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native'
export const AuthContext = createContext({})
import db from "../Services/sqlite/connect";

const comandoSql = (query) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
            query,
            [],
            //-----------------------
            (_, { rowsAffected, insertId, rows }) => {
            resolve({rowsAffected, insertId, rows})
            // if (rowsAffected > 0) resolve({rowsAffected, insertId, rows});
            // else reject("Error inserting query: " + JSON.stringify(query)); // insert falhou
            },
            (_, error) => reject('Erro de cadastro: '+error) // erro interno em tx.executeSql
        );
        });
    });
};



function AuthProvider({children}){

    const navegation = useNavigation()
    const [sessaoRestaurante, setSessaoRestaurante] = useState({})
    const [sessaoUsuario, setSessaoUsuario] = useState({})


    useEffect(()=>{

        comandoSql( `SELECT * FROM restaurante WHERE codigo = '1'`)
        .then( retorno => {
            retorno.rows._array.forEach( c => {
                        // results.push(c)
                        // console.warn(c)
                        setSessaoRestaurante(c)
                    })

        })
        .catch( err => {
             console.warn('Erro de cadastro: '+err)
        })



    }),[setSessaoRestaurante];


    function logarUsuario(cpf){

        if(!cpf){
            alert('Favor informe o número do CPF');
            return false
        }else if(cpf.length != 14){
            alert('Informação incompleta, favor preencha o campo CPF');
            return false
        }


        comandoSql( `SELECT * FROM usuarios WHERE cpf = '${cpf}'`)
        .then( retorno => {
            // alert(retorno.rows.length)
            if(retorno.rows.length){
                retorno.rows._array.forEach( c => {
                            // results.push(c)
                            // console.warn('TEM:')
                            // console.warn(c)
                            setSessaoUsuario(c)
                        })
            }else{
                comandoSql( `INSERT INTO usuarios (cpf) VALUES ('${cpf}')`)

                comandoSql( `SELECT * FROM usuarios WHERE cpf = '${cpf}'`)
                .then( retorno => {
                    retorno.rows._array.forEach( c => {
                                // results.push(c)
                                // console.warn('NÃO TEM:')
                                // console.warn(c)
                                setSessaoUsuario(c)
                            })

                })
                .catch( err => {
                     console.warn('Erro de cadastro: '+err)
                })

            }
            navegation.navigate("Pesquisa")
        })
        .catch( err => {
             console.warn('Erro de cadastro: '+err)
        })

    }


    function AtivarRestaurante(opc){
        // alert(`Estou no restaurante de código ${opc.local}`)

        comandoSql( `REPLACE INTO restaurante (codigo, restaurante, titulo, local) VALUES ('1',${opc.codigo},'${opc.titulo}','${opc.local}')`)
        .then( retorno => {

            comandoSql( `SELECT * from restaurante where codigo = '1'`)
            .then( retorno => {
                // console.warn('Affected: '+ retorno.rowsAffected)
                // console.warn('Id: '+ retorno.insertId)
                // let results = [];
                retorno.rows._array.forEach( c => {
                            // console.warn(c)
                            setSessaoRestaurante(c)
                        })

            })
            .catch( err => {
                 console.warn('Erro de cadastro: '+err)
            })

        })
        navegation.navigate("Start")


        // comandoSql( `SELECT * FROM restaurante WHERE codigo = '1'`)
        // .then( retorno => {
        //     // console.warn('Affected: '+ retorno.rowsAffected)
        //     // console.warn('Id: '+ retorno.insertId)
        //     let results = [];
        //     retorno.rows._array.forEach( c => {
        //                 // console.warn(c)
        //                 results.push(c)
        //             })

        //     //navegation.navigate("Lista")
        // })
        // .catch( err => {
        //      console.warn('Erro de cadastro: '+err)
        // })

    }

    return(
        <AuthContext.Provider value={{ nome:"Tamer Elmenoufi", logarUsuario, sessaoRestaurante, AtivarRestaurante, sessaoUsuario }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider