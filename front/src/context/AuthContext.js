import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/api/check_auth');
                if (response.status === 200) {
                    setIsAuthenticated(true);
                    localStorage.setItem('isAuthenticated', 'true');
                }
            } catch (error) {
                setIsAuthenticated(false);
                localStorage.removeItem('isAuthenticated');
            }
        };

        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await axios.post('/api/logout');
            setIsAuthenticated(false);
            localStorage.removeItem('isAuthenticated');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
