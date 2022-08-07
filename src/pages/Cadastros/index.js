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



const Cadastros = ()=>{

    const navegation = useNavigation();
    const {sessaoUsuario, sessaoRestaurante} = useContext(AuthContext)


    const schema = yup.object({
        cpf: yup.string().min(14,'Informe o número do CPF completo').required("Informe o número do CPF").nullable(),
        nome: yup.string().required("Informe seu nome completo").nullable(),
        telefone: yup.string().min(15,'Digite o número do telefone completo').required("Informe seu telefone").nullable(),
        endereco: yup.string().required("Seu Endereço").nullable(),
    })


    const { control, handleSubmit, formState:{errors}, reset } = useForm({
        resolver: yupResolver(schema),
        // defaultValues:{
        //     cpf: sessaoUsuario.cpf,
        //     nome: sessaoUsuario.nome,
        //     telefone: sessaoUsuario.telefone,
        //     endereco:sessaoUsuario.endereco
        // },
    })

    function handleSignIn(data){

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

        // console.warn(dataFormatada)
        //Cadastro
        comandoSql( `REPLACE INTO usuarios (nome, cpf, telefone, restaurante, titulo, local, endereco, data, origem, upload) VALUES ('${data.nome}','${data.cpf}','${data.telefone}','${sessaoRestaurante.restaurante}','${sessaoRestaurante.titulo}','${sessaoRestaurante.local}','${data.endereco}','${dataFormatada}','cpf','n')`)
        .then( retorno => {

            api.post('/cadUser.php', {
                codigo: retorno.insertId,
                nome: data.nome,
                cpf: data.cpf,
                telefone: data.telefone,
                titulo: sessaoRestaurante.titulo,
                local: sessaoRestaurante.local,
                restaurante: sessaoRestaurante.restaurante,
                endereco: data.endereco,
                origem: 'cpf',
                data: dataFormatada,
            }).then(({data}) => {
                // console.warn(data)
                //  alert(data.message)
                if(data.status){
                    comandoSql( `UPDATE usuarios SET upload = 's' WHERE codigo = '${retorno.insertId}'`)
                }


            }).catch( err => console.warn('no upload: ' + err) )


            // reset();

            //
        })
        .catch( err => console.warn('Erro de cadastro: ' + err) )

        alert("Cadastro realizado com sucesso!")
        navegation.navigate("Start")


    }


    return (

        <View style={{flex:1, width:'100%', justifyContent:'center', alignItems:'center'}}>
            <View style={{width:'95%', height:40, marginTop:30}}>
                <Text style={{color:'#333', fontSize:20, padding:5}}>Registro dos dados</Text>
            </View>
            <View style={{flex:14,width:'95%'}}>
                <ScrollView style={{flex:1, paddingEnd:30, paddingStart:30, width:'100%'}}>

                    <InputForm
                        campo="cpf"
                        rotulo="CPF"
                        placeholder="Digite o número do CPF"
                        control={control}
                        errors={errors.cpf}
                        value=''
                        mask={true}
                        type={'cpf'}
                        options={false}
                    />

                    <InputForm
                        campo="nome"
                        rotulo="Nome"
                        placeholder="Digite seu nome"
                        control={control}
                        errors={errors.nome}
                        value=''
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
                        value=''
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
                        value=''
                        mask={false}
                        type={false}
                        options={false}
                    />

                </ScrollView>
            </View>

            <View style={{flex:3,width:'95%', height:40, flexDirection:'row', flexWrap:'nowrap', justifyContent:'center'}}>
                <TouchableOpacity style={{height:60, flexDirection:'row', width:'60%', margin:20, borderRadius:100, backgroundColor:'green', justifyContent:'center', alignItems:'center'}} onPress={handleSubmit(handleSignIn)}>
                    <Icon name="user" size={25} color="#fff" />
                    <Text style={{color:'#fff', fontSize:25, padding:5}}>CADASTRAR</Text>
                </TouchableOpacity>
            </View>

        </View>

    )
}

export default Cadastros


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