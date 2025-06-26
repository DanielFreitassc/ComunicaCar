import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Service } from '../../../screens/Mecanico/Service';
import { Home } from '../../../screens/Atendente/Home';

export function MecanicoNavigationRoutes() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName='Home'
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Service" component={Service} />
        </Stack.Navigator>
    )
}