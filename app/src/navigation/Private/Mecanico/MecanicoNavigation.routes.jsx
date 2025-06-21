// app/navigation/public/PrivateNavigationRoutes.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
<<<<<<< HEAD:app/src/navigation/Private/Mecanico/MecanicoNavigation.routes.jsx
import { Service } from '../../../screens/Mecanico/Service';
import { Home } from '../../../screens/Mecanico/Home';

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
=======
// Import the default export from your Home screen folder:
import Home from '../../screens/Atendente/Home';

const Stack = createNativeStackNavigator();

export function PrivateNavigationRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
>>>>>>> ded28386ff9ba492ffb8c7d79e4d00daab1e7776:app/src/navigation/Public/PrivateNavigation.routes.jsx
