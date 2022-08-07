import React, { useState, useEffect, useContext } from 'react'
import { Text, View, StyleSheet, Button, PermissionsAndroid } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { AuthContext } from '../contexts/auth'
import db from "../Services/sqlite/connect";
import { useNavigation } from '@react-navigation/native'

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





export default function Scanner(){

    const {sessaoRestaurante:logado, setSessaoUsuario} = useContext(AuthContext)
    const navegation = useNavigation();
    const [permissao, setPermissao] = useState(null)
    const [scanear, setScanear] = useState(false)



    function CadastroQrcode(dados){
        comandoSql( `UPDATE usuarios SET origem = 'qrcode' WHERE cpf = '${dados.cpf}'`)
        comandoSql( `SELECT * FROM usuarios WHERE cpf = '${dados.cpf}'`)
        .then( retorno => {
            // alert(retorno.rows.length)
            if(retorno.rows.length){
                retorno.rows._array.forEach( c => {
                            // results.push(c)
                            // console.warn('Encontrei:')
                            // console.warn(c)
                            setSessaoUsuario(c)
                            navegation.navigate("Pesquisa")
                        })
            }else{


                let dataEnvio = new Date();
                let dataFormatada = dataEnvio.getFullYear() +
                                    "-" +
                                    ((dataEnvio.getMonth() + 1)) +
                                    "-" +
                                    (dataEnvio.getDate()) +
                                    " " +
                                    (dataEnvio.getHours()) +
                                    ":" +
                                    (dataEnvio.getMinutes()) +
                                    ":" +
                                    (dataEnvio.getSeconds())

                comandoSql( `INSERT INTO usuarios (nome, cpf, telefone, endereco, restaurante, titulo, local, data, origem, upload) VALUES ('${dados.nome}','${dados.cpf}','${dados.telefone}','${dados.endereco}','${logado.estaurante}','${logado.titulo}','${logado.local}','${dataFormatada}', 'qrcode','n')`).
                then(()=>{
                    comandoSql( `SELECT * FROM usuarios WHERE cpf = '${dados.cpf}'`)
                    .then( retorno => {
                        retorno.rows._array.forEach( c => {
                                    // results.push(c)
                                    // console.warn('NÃO Encontrie:')
                                    // console.warn(c)
                                    setSessaoUsuario(c)
                                    navegation.navigate("Pesquisa")


                                })

                    })
                    .catch( err => {
                        console.warn('Erro de cadastro: '+err)
                    })
                })

            }
            // navegation.navigate("Pesquisa")
        })
        .catch( err => {
             console.warn('Erro de cadastro: '+err)
        })

    }

    useEffect(()=>{
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setPermissao(status === 'granted')
        })()
    },[])

    const BarcodScanear = ({type, data}) => {
        setScanear(true)
        // alert(`Tipo ${type} e informação ${data}`)
        const tratado = JSON.parse(data);
        // alert(tratado.nome)
        CadastroQrcode(tratado)
    }

    if(permissao == null){
        return <Text>Precisa de permissão</Text>
    }
    if(permissao === false){
        return <Text>Camera sem acesso</Text>
    }

    return (
        <View style={Styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanear ? undefined : BarcodScanear}
                style={Styles.barcode}
            />
            {/* {scanear && <Button title="CLIQUE AQUI PARA ESCANEAR NOAVAMENTE" onPress={()=>{BarcodScanear}} />} */}
        </View>
    )

}

const Styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center'
    },
    barcode:{
        flex:1,
    },

})