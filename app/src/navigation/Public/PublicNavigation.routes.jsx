import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from '../../screens/Welcome';
import { Login } from '../../screens/Login';

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