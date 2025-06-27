// contexts/auth/authContext.js

import React, { createContext, useState, useEffect } from 'react';
import { AuthStore } from '../../infra/stores/AuthStore';
import { api } from '../../infra/apis/api'; // Importe sua API

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const authStore = new AuthStore();

    const [token, setToken] = useState(null);
    const [isAtendente, setIsAtendente] = useState(false);
    const [loading, setLoading] = useState(true); 


    useEffect(() => {
        async function loadStorageData() {
            const storedData = await authStore.get(); 

            if (storedData && storedData.token) {
                setToken(storedData.token);
                setIsAtendente(storedData.isAtendente || false); // Exemplo
                api.defaults.headers.common['Authorization'] = `Bearer ${storedData.token}`;
            }
            setLoading(false); 
        }
        
        loadStorageData();
    }, []);


    async function logout() {
        try {
            await authStore.remove(); 
            delete api.defaults.headers.common['Authorization'];
            setToken(null); 
            setIsAtendente(false);
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    }

    return (
        <AuthContext.Provider value={{ signed: !!token, token, setToken, isAtendente, setIsAtendente, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};