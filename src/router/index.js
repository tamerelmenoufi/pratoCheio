import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Start from '../pages/Start'
import Restaurantes from "../pages/Restaurantes";
import Login from '../pages/Login'
import Pesquisa from '../pages/Pesquisa'
import ListaUsuarios from '../pages/usuarios'
import Votos from '../pages/Votos'
import QrCode from '../QrCode'
 import Cadastros from '../pages/Cadastros'

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
            <Stack.Screen
                name="Votos"
                component={Votos}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="QrCode"
                component={QrCode}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Cadastros"
                component={Cadastros}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>
    );
}