import { createNativeStackNavigator } from '@react-navigation/native-stack';
<<<<<<< HEAD
import { Welcome } from '../../screens/Comuns/Welcome';
=======
import { Welcome } from '../../screens/Comuns/Welcome/index';
>>>>>>> 69c26e89ce07b8c57afdb0609965fce62b8817a5
import { Login } from '../../screens/Comuns/Login';

export function PublicNavigationRoutes() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName='Welcome'
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    )
}