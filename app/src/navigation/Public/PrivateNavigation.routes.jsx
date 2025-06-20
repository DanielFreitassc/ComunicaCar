// app/navigation/public/PrivateNavigationRoutes.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
