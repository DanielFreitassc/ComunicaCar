import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { useFonts, Cairo_400Regular, Cairo_500Medium,Cairo_700Bold } from '@expo-google-fonts/cairo';
export default function App() {
  const Stack = createNativeStackNavigator();

  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_700Bold
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='WelcomeScreen'>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}