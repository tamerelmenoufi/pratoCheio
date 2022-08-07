import React, {useState, useEffect, useContext} from "react"
import Icon from 'react-native-vector-icons/FontAwesome5';
import { View,
         Text,
         StyleSheet,
         Image,
         TouchableOpacity
        } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import db from "../../Services/sqlite/connect";
import { AuthContext } from '../../contexts/auth'

const api = axios.create({
    baseURL:'http://project.mohatron.com/projectRestaurantes/api/'
})

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

/////////////////ATUALIZAR OS DADOS DOS CADASTRO PENDENTES////////////////////
function EnviarNuvemCadastros(cod = false){
    // console.warn('passou pelos cadastros')
    if(cod){
        var query = `SELECT * FROM usuarios where codigo = '${cod}'`
        // alert('com codigo')
    }else{
        var query = `SELECT * FROM usuarios where upload != 's'`
        // alert('sem codigo')
    }
    comandoSql(query)
    .then( retorno => {
        const dados = [];
        // alert(retorno.rows.length)
        retorno.rows._array.forEach( c => {
            // console.warn(c)
            api.post('/cadUser.php', {
                codigo: c.codigo,
                nome: c.nome,
                cpf: c.cpf,
                telefone: c.telefone,
                titulo: c.titulo,
                local: c.local,
                restaurante: c.restaurante,
                endereco: c.endereco,
                data: c.data,
            }).then(({data}) => {
                // console.warn(data)
                //   alert(data.message)
                if(data.status){
                    comandoSql( `UPDATE usuarios SET upload = 's' WHERE codigo = '${c.codigo}'`)
                }

            }).catch( err => console.warn('no upload: ' + err) )


        })
    })
}
//////////////////////////////////////////////////////////////////////////////
////////////////////////ATUALIZACAO DOS VOTOS ////////////////////////////////
function EnviarNuvemVotos(cod = false){
    // console.warn('passou pelos votos')
    if(cod){
        var query = `SELECT * FROM votos where codigo = '${cod}'`
    }else{
        var query = `SELECT * FROM votos where upload != 's'`
    }
    comandoSql(query)
    .then( retorno => {
        const dados = [];
        retorno.rows._array.forEach( c => {
            api.post('/cadVoto.php', {
                restaurante: c.restaurante,
                usuario: c.usuario,
                voto: c.voto,
                data: c.data,
            }).then(({data}) => {
                if(data.status){
                    comandoSql( `UPDATE votos SET upload = 's' WHERE codigo = '${c.codigo}'`)
                }
            }).catch( err => console.warn('no upload: ' + err) )
        })
    })
}
/////////////////////////////////////////////////////////////////////////////////////////////


export default function Start(){
    const navegation = useNavigation()

    const {sessaoRestaurante:logado} = useContext(AuthContext)



    useEffect(()=>{
        EnviarNuvemCadastros()
        EnviarNuvemVotos()
    },[])


    return(
        <View style={styles.container}>
            <View style={styles.containerLogo}>
                <Animatable.Image
                    animation="flipInY"
                    source={require('../../assets/logo.png')}
                    style={{width:'100%'}}
                    resizeMode="contain"
                />
            </View>

            <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
                <View style={{flex:3}}>
                    <Text style={styles.title}>Prato Cheio - Governo do Estado do Amazonas</Text>
                    <Text style={styles.text}>Para iniciar o cadastros e avaliação, acesse a localização do seu restaurante</Text>
                </View>
                {logado.restaurante?
                <>
                <View style={{flex:1}}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={()=> navegation.navigate('Login')}
                    >
                        <Text style={styles.buttonText}>{logado.titulo} {logado.local}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex:2, flexDirection:'row'}}>
                    <View style={{flex:1}}>
                        <TouchableOpacity
                            style={styles.button2}
                            onPress={()=> navegation.navigate('Restaurantes')}
                        >
                            <Icon name="fish" size={20} color="#fff" />
                            <Text style={styles.buttonText}>Restaurantes</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1}}>
                        <TouchableOpacity
                            style={styles.button2}
                            onPress={()=> navegation.navigate('ListaUsuarios')}
                        >
                            <Icon name="users" size={20} color="#fff" />
                            <Text style={styles.buttonText}>Usuários</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{flex:1}}>
                        <TouchableOpacity
                            style={styles.button2}
                            onPress={()=> navegation.navigate('Votos')}
                        >
                            <Icon name="hand-point-up" size={20} color="#fff" />
                            <Text style={styles.buttonText}>Votos</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                </>
                :
                <View style={{flex:1}}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={()=> navegation.navigate('Restaurantes')}
                    >
                        <Text style={styles.buttonText}>Localizar Restaurante</Text>
                    </TouchableOpacity>
                </View>
                }

            </Animatable.View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#1daf4c'
    },
    containerLogo:{
        flex:2,
        justifyContent:'center',
        textAlign:'center'
    },
    containerForm:{
        flex:1,
        backgroundColor:'#fff',
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        paddingStart:'5%',
        paddingEnd:'5%'
    },
    title:{
        fontSize:24,
        fontWeight:'bold',
        marginBottom:10,
        marginTop:28
    },
    text:{
        color:'#a1a1a1'
    },
    button:{
        position:'absolute',
        backgroundColor:'#1daf4c',
        borderRadius:50,
        paddingVertical:8,
        width:'60%',
        height:60,
        alignSelf:'center',
        bottom:'15%',
        alignItems:'center',
        justifyContent:'center'
    },
    button2:{
        position:'absolute',
        backgroundColor:'red',
        borderRadius:50,
        paddingVertical:8,
        width:'90%',
        alignSelf:'center',
        bottom:'15%',
        alignItems:'center',
        justifyContent:'center'
    },
    buttonText:{
        fontSize:14,
        color:'#fff',
        fontWeight:'bold'
    }
})