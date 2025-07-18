import React, {createContext, useContext, useEffect, useState} from 'react';
import {authAPI} from '../services/api';

interface User {
    id: string;
    collegeId: string;
    role: 'student' | 'admin';
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    login: (collegeId: string, password: string) => Promise<void>;
    register: (collegeId: string, password: string, phone: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        console.log("Token from localStorage:", token);

        if (token && userData && userData != "undefined") {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (collegeId: string, password: string) => {
        try {
            const response = await authAPI.login(collegeId, password);
            const {user, token} = response.data.data;

            console.log("USER", user, token, response);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
        } catch (error) {
            throw new Error('Login failed');
        }
    };

    const register = async (collegeId: string, password: string, phone: string) => {
        try {
            const response = await authAPI.register(collegeId, password, phone);
            const {user, token} = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
        } catch (error) {
            throw new Error('Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, login, register, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};