import { NavigationContainer } from '@react-navigation/native';
import { PublicNavigationRoutes } from "./Public/PublicNavigation.routes"
export function RootNavigationContainer() {
    return (
        <NavigationContainer>
            <PublicNavigationRoutes />
        </NavigationContainer>
    )
}