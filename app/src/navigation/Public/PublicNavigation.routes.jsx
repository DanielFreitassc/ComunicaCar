import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Welcome } from '../../screens/Comuns/Welcome';
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