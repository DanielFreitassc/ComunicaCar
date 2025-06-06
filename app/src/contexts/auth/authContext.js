import { createContext, useState } from 'react';
import { AuthStore } from '../../infra/stores/AuthStore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const authStore = new AuthStore();

    const [token, setToken] = useState(null);

    async function logout() {
        setToken(null)
        authStore.remove()
    }

    return (
        <AuthContext.Provider value={{ token, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};