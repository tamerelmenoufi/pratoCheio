import React, {useState, useEffect, useContext} from "react"
import { FlatList, View, Text, TouchableOpacity } from 'react-native'
// import {ListItem} from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import db from "../../Services/sqlite/connect";
import axios from 'axios'
import { AuthContext } from '../../contexts/auth'


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



const api = axios.create({
    baseURL:'http://project.mohatron.com/projectRestaurantes/api/'
})

export default ListaRestaurantes => {

    const navegation = useNavigation()
    const {AtivarRestaurante} = useContext(AuthContext)

    const [restaurantes, setRestaurantes] = useState([])

    useEffect(()=>{
        api.get('/restaurantes.php').then(({data}) => {
            //console.warn(data)
            setRestaurantes(data)
        })


    },[])





    function getRestauranteItem({item}){
        return (

            <TouchableOpacity style={{
                flex:1,
                flexDirection:'row',
                paddingVertical:10,
                marginBottom:10,
                borderRadius:7,
                backgroundColor:'green',
            }}

            onPress={()=> AtivarRestaurante(item)}

            >
                {/* <Text style={{
                    paddingHorizontal:10,
                    fontSize:20,
                    color:'#fff',
                }}>{item.codigo}</Text> */}
                <View style={{
                    flex:1,
                    flexDirection:'column',
                }}>
                    <Text style={{
                        paddingHorizontal:16,
                        fontSize:10,
                        color:'#a1a1a1',
                    }}>{item.titulo}</Text>
                    <Text style={{
                        paddingHorizontal:16,
                        fontSize:20,
                        color:'#fff',
                    }}>{item.local}</Text>
                    {/* <Text style={{
                        paddingHorizontal:16,
                        fontSize:15,
                        color:'#fff',
                    }}>{item.local}</Text> */}
                </View>
            </TouchableOpacity>

        )
    }


    return (
        <View style={{marginTop:30, marginHorizontal:15, paddingBottom:50,}}>
            <Text style={{
                paddingVertical:10,
                fontSize:20,
            }}>Lista de Restaurantes disponíveis</Text>
            <FlatList
                keyExtractor={restaurante => restaurante.codigo}
                data={restaurantes}
                renderItem={getRestauranteItem}
            />
        </View>
    )
}