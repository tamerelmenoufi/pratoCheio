import React from "react";
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { Controller } from 'react-hook-form'
import {TextInputMask} from 'react-native-masked-text'

export default function InputForm(props){
    return (
        <Controller
            control={props.control}
            name={props.campo}
            render={({field:{onChange, onBlur, value, setValue}})=>(
                <View>
                    <Text style={styles.title}>{props.rotulo}</Text>
                    { props.mask ?
                    <TextInputMask
                        placeholder={props.placeholder}
                        style={[styles.input,{
                            borderWidth: props.errors && 1,
                            borderColor: props.errors && 'red'
                        }]}
                        value={value}
                        defaultValue={props.value && props.value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        setValue={setValue}
                        type={props.type}
                        options={props.options}

                    />
                    :
                    <TextInput
                        placeholder={props.placeholder}
                        style={[styles.input,{
                            borderWidth: props.errors && 1,
                            borderColor: props.errors && 'red'
                        }]}
                        value={value}
                        defaultValue={props.value && props.value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        setValue={setValue}

                    />
                    }
                    {props.errors && <Text>{props.errors?.message}</Text>}
                </View>
            )}
        />
    )
}

const styles = StyleSheet.create({
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