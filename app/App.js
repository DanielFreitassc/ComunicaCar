import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Cairo_400Regular, Cairo_500Medium,Cairo_700Bold } from '@expo-google-fonts/cairo';
import { RootNavigationContainer } from './src/navigation';

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
    <RootNavigationContainer/>
  );
}