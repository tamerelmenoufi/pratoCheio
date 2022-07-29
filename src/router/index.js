import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Start from '../pages/Start'
import Restaurantes from "../pages/Restaurantes";
import Login from '../pages/Login'
import Pesquisa from '../pages/Pesquisa'
import ListaUsuarios from '../pages/usuarios'

// import Formulario from '../pages/Formularios/index'
// import Lista from '../pages/Formularios/lista'

const Stack = createNativeStackNavigator();

export default function Router(){
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Start"
                component={Start}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Restaurantes"
                component={Restaurantes}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Pesquisa"
                component={Pesquisa}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ListaUsuarios"
                component={ListaUsuarios}
                options={{ headerShown: false }}
            />

            {/*

            <Stack.Screen
                name="Formulario"
                component={Formulario}
                options={{ headerShown: true }}
            />
            <Stack.Screen
                name="Lista"
                component={Lista}
                options={{ headerShown: true }}
            /> */}

        </Stack.Navigator>
    );
}