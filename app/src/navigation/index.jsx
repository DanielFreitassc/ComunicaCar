import { NavigationContainer } from '@react-navigation/native';
import { PublicNavigationRoutes } from "./Public/PublicNavigation.routes"
import { PrivateNavigationRoutes } from "./Private/PrivateNavigation.routes"
import { useAuth } from '../hooks/authHook';
import { AuthStore } from '../infra/stores/AuthStore';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

export function RootNavigationContainer() {
    const { setToken, token,  setIsAtendente } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        recuperarToken();
    }, []);
    
    async function recuperarToken() {
        setIsLoading(true);
        try {
            const authStore = new AuthStore();
            const auth = await authStore.get();
            setIsAtendente(auth.isAtendente)
            setToken(auth.token);
        } catch (error) {
            setToken(null);
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <NavigationContainer>
            {isLoading ? <ActivityIndicator /> : token ? <PrivateNavigationRoutes /> : <PublicNavigationRoutes />}
        </NavigationContainer>
    )
}