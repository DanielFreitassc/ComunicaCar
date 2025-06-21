import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MecanicoNavigationRoutes } from "./Mecanico/MecanicoNavigation.routes"

export function PrivateNavigationRoutes() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName='Mecanico'
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Mecanico" component={MecanicoNavigationRoutes} />
        </Stack.Navigator>
    )
}