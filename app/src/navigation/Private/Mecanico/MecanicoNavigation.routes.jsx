import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Service } from '../../../screens/Mecanico/Service';
import { Home } from '../../../screens/Mecanico/Home';
import FinishJobs from '../../../screens/Mecanico/FinishJobs';

export function MecanicoNavigationRoutes() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName='FinishJobs'
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Service" component={Service} />
            <Stack.Screen name="FinishJobs" component={FinishJobs} />
        </Stack.Navigator>
    )
}
