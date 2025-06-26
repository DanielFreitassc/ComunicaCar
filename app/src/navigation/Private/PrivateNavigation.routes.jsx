import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MecanicoNavigationRoutes } from "./Mecanico/MecanicoNavigation.routes"
import { AtendenteNavigationRoutes } from './Atendente/AtendenteNavigation.routes';
import { useAuth } from '../../hooks/authHook';

export function PrivateNavigationRoutes() {
    const { isAtendente } = useAuth();
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Mecanico"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Mecanico" component={MecanicoNavigationRoutes} />
            <Stack.Screen name="Atendente" component={AtendenteNavigationRoutes} />
        </Stack.Navigator>
    )
}