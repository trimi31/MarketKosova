'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '@/lib/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (data: LoginRequest) => {
        const response = await api.post<AuthResponse>('/api/auth/login', data);
        const authData = response.data;

        const userData: User = {
            userId: authData.userId,
            username: authData.username,
            email: authData.email,
            role: authData.role,
            token: authData.token,
        };

        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const register = async (data: RegisterRequest) => {
        const response = await api.post<AuthResponse>('/api/auth/register', data);
        const authData = response.data;

        const userData: User = {
            userId: authData.userId,
            username: authData.username,
            email: authData.email,
            role: authData.role,
            token: authData.token,
        };

        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'ADMIN',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
