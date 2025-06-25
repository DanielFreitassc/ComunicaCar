import { createContext, useState } from 'react';
import { AuthStore } from '../../infra/stores/AuthStore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const authStore = new AuthStore();

    const [token, setToken] = useState(null);
    const [isAtendente, setIsAtendente] = useState(true);

    async function logout() {
        setToken(null)
        authStore.remove()
    }

    return (
        <AuthContext.Provider value={{ token, setToken, isAtendente, setIsAtendente, logout }}>
            {children}
        </AuthContext.Provider>
    );
};