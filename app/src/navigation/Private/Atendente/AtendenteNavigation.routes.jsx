import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Service } from '../../../screens/Atendente/Service';
import { Home } from '../../../screens/Atendente/Home';
import { Text } from "react-native"
import { CreateService } from '../../../screens/Atendente/Services/Create';
import { EditService } from '../../../screens/Atendente/Services/Edit';

export function AtendenteNavigationRoutes() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName='Home'
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="CreateService" component={CreateService} />
            <Stack.Screen name="EditService" component={EditService} />
            {/* <Stack.Screen name="Service" component={Service} /> */}
        </Stack.Navigator>
    )
}
