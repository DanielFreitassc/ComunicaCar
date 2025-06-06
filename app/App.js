import { useFonts, Cairo_400Regular, Cairo_500Medium,Cairo_700Bold } from '@expo-google-fonts/cairo';
import { RootNavigationContainer } from './src/navigation';
import { AuthProvider } from './src/contexts/auth/authContext';

export default function App() {

  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_700Bold
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <AuthProvider>
      <RootNavigationContainer/>
    </AuthProvider>
  );
}