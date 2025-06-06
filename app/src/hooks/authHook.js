import { useContext } from 'react';
import { AuthContext } from '../contexts/auth/authContext';

export const useAuth = () => {
    return useContext(AuthContext);
};
