import React, {useContext} from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import db from "../../Services/sqlite/connect";
import InputForm from "../../components/formText";
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { AuthContext } from '../../contexts/auth'
import Icon from 'react-native-vector-icons/FontAwesome';

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



const Pesquisa = ()=>{

    const navegation = useNavigation();
    const {sessaoUsuario, sessaoRestaurante} = useContext(AuthContext)



    const schema = yup.object({
        nome: yup.string().required("Informe seu nome completo"),
        telefone: yup.number().required("Informe seu telefone"),
        endereco: yup.string().required("Seu Endereço"),
    })


    const { control, handleSubmit, formState:{errors}, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues:{
                        nome: sessaoUsuario.nome,
                        telefone: sessaoUsuario.telefone,
                        endereco:sessaoUsuario.endereco
                    },
    })

    function handleSignIn(data, voto){

        //Cadastro
        comandoSql( `REPLACE INTO usuarios (codigo, nome, cpf, telefone, restaurante, titulo, local, endereco, data, upload) VALUES ('${sessaoUsuario.codigo}','${data.nome}','${sessaoUsuario.cpf}','${data.telefone}','${sessaoRestaurante.restaurante}','${sessaoRestaurante.titulo}','${sessaoRestaurante.local}','${data.endereco}',datetime('now'),'n')`)
        .then( retorno => {

            api.post('/cadUser.php', {
                codigo: sessaoUsuario.codigo,
                nome: data.nome,
                cpf: sessaoUsuario.cpf,
                telefone: data.telefone,
                titulo: sessaoRestaurante.titulo,
                local: sessaoRestaurante.local,
                restaurante: sessaoRestaurante.restaurante,
                endereco: data.endereco,
                data: 'data',
            }).then(({data}) => {
                // console.warn(data)
                //  alert(data.message)
                if(data.status){
                    comandoSql( `UPDATE usuarios SET upload = 's' WHERE codigo = '${sessaoUsuario.codigo}'`)
                }


            }).catch( err => console.warn('no upload: ' + err) )


            // reset();

            //
        })
        .catch( err => console.warn('Erro de cadastro: ' + err) )



        //Voto
        comandoSql( `INSERT INTO votos (restaurante, usuario, voto, data, upload) VALUES ('${sessaoRestaurante.restaurante}','${sessaoUsuario.cpf}','${voto}',datetime('now'),'n')`)
        .then( retorno => {
            const NovoId = retorno.insertId;
            api.post('/cadVoto.php', {
                restaurante: sessaoRestaurante.restaurante,
                usuario: sessaoUsuario.cpf,
                voto: voto,
                data: 'data',
            }).then(({data}) => {
                // console.warn(data)
                //   alert(data.message)

                if(data.status){
                    comandoSql( `UPDATE votos SET upload = 's' where codigo = '${NovoId}'`)
                }

            }).catch( err => console.warn('no upload: ' + err) )

        })
        .catch( err => console.warn('Erro de cadastro: ' + err) )

        alert("Voto Registrado!\nObrigado pela sua contribuição.")
        navegation.navigate("Start")


    }


    const Ruim = (data) => {handleSignIn(data, 'Ruim')}
    const Regular = (data) => {handleSignIn(data, 'Regular')}
    const Bom = (data) => {handleSignIn(data, 'Bom')}
    const Otimo = (data) => {handleSignIn(data, 'Otimo')}
    const Excelente = (data) => {handleSignIn(data, 'Excelente')}

    const BtVoto = 125

    return (




        <View style={{flex:1, width:'100%', justifyContent:'center', alignItems:'center'}}>
            <View style={{width:'95%', height:40, marginTop:30}}>
                <Text style={{color:'#333', fontSize:20, padding:5}}>Registro dos dados</Text>
            </View>
            <View style={{flex:6,width:'95%'}}>
                <ScrollView style={{flex:1, paddingEnd:30, paddingStart:30, width:'100%'}}>

                    <InputForm
                        campo="nome"
                        rotulo="Nome"
                        placeholder="Digite seu nome"
                        control={control}
                        errors={errors.nome}
                        value={sessaoUsuario.nome}
                        mask={false}
                        type={false}
                        options={false}
                    />

                    <InputForm
                        campo="telefone"
                        rotulo="Telefone"
                        placeholder="Digite seu Telefone"
                        control={control}
                        errors={errors.telefone}
                        value={sessaoUsuario.telefone}
                        mask={true}
                        type={'cel-phone'}
                        options={{
                            maskType:'BRL',
                            withDDD: true,
                            dddMask: '(99) '
                        }}
                    />

                    <InputForm
                        campo="endereco"
                        rotulo="Endereço Completo"
                        placeholder="Rua, bairro, casa, CEP, complemento, Bairro, Cidade - Estado"
                        control={control}
                        errors={errors.endereco}
                        value={sessaoUsuario.endereco}
                        mask={false}
                        type={false}
                        options={false}
                    />

                </ScrollView>
            </View>
            <View style={{padding:0, margin:0}}>
                <Text style={{color:'#333', fontSize:20, padding:0}}>Sua opinião quanto ao atendimento e a refeição</Text>
            </View>
            <View style={{flex:3,width:'95%', height:40, flexDirection:'row', flexWrap:'nowrap', justifyContent:'center'}}>
                <TouchableOpacity style={{height:BtVoto, width:BtVoto, margin:20, borderRadius:100, backgroundColor:'red', justifyContent:'center', alignItems:'center'}} onPress={handleSubmit(Ruim)}>
                    <Icon name="frown-o" size={BtVoto} color="#fff" />
                    {/* <Text style={{color:'#fff', fontSize:10, padding:5}}>RUIM</Text> */}
                </TouchableOpacity>

                <TouchableOpacity style={{height:BtVoto, width:BtVoto, margin:20, borderRadius:100, backgroundColor:'orange', justifyContent:'center', alignItems:'center'}} onPress={handleSubmit(Regular)}>
                    <Icon name="meh-o" size={BtVoto} color="#fff" />
                    {/* <Text style={{color:'#fff', fontSize:10, padding:5, height:40}}>BOM</Text> */}
                </TouchableOpacity>

                <TouchableOpacity style={{height:BtVoto, width:BtVoto, margin:20, borderRadius:100, backgroundColor:'green', justifyContent:'center', alignItems:'center'}} onPress={handleSubmit(Bom)}>
                    <Icon name="smile-o" size={BtVoto} color="#fff" />
                    {/* <Text style={{color:'#fff', fontSize:10, padding:5, height:40}}>EXCELENTE</Text> */}
                </TouchableOpacity>

                {/* <TouchableOpacity style={{height:40, borderRadius:8, backgroundColor:'green'}} onPress={handleSubmit(Otimo)}>
                    <Text style={{color:'#fff', fontSize:20, padding:5, height:40}}>ÓTIMO</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{height:40, borderRadius:8, backgroundColor:'blue'}} onPress={handleSubmit(Excelente)}>
                    <Text style={{color:'#fff', fontSize:20, padding:5}}>EXCELENTE</Text>
                </TouchableOpacity> */}

            </View>

        </View>

    )
}

export default Pesquisa


const styles = StyleSheet.create({
    buttonSalvar:{
        width:'90%',
        backgroundColor:'blue',
        borderRadius:7,

    },
    buttonRSalvarText:{
        color:'#fff',
        fontSize:18,
        textAlign:'center',
        padding:7,
    },
    title:{
        fontSize:20,
        marginTop:28,
    },
    input:{
        borderBottomWidth:1,
        height:40,
        marginBottom:12,
        fontSize:16,
    },
})