'use client';
import { User, AuthContextType } from '../context/authTypes';
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { decodeToken } from '../utils/jwtUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [loading, user, router]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            decodeToken(token)
                .then((decoded) => {
                    if (decoded) {
                        const role = decoded.role as User['role'];
                        // Verifica se a role é válida
                        if (role === 'admin' || role === 'user') {
                            const loggedInUser: User = {
                                token,
                                username: decoded.username,
                                role,
                                userlogin: decoded.userlogin,
                                email: decoded.email,
                            };
                            setUser(loggedInUser);
                            router.push('/home');
                        } else {
                            console.error('Role inválida:', role);
                        }
                    } else {
                        console.error('Failed to decode token');
                    }
                    setLoading(false);
                })
                .catch((error: unknown) => {
                    if (error instanceof Error) {
                        console.error('Error decoding token:', error.message);
                    } else {
                        console.error(
                            'Unknown error occurred during token decoding'
                        );
                    }
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Usuário ou senha inválidos.');
            }

            localStorage.setItem('token', data.access_token);
            const decoded = await decodeToken(data.access_token);

            if (decoded) {
                const role = decoded.role as User['role'];
                if (role) {
                    const loggedInUser: User = {
                        token: data.access_token,
                        username: decoded.username,
                        role,
                        userlogin: decoded.userlogin,
                        email: decoded.email,
                    };
                    setUser(loggedInUser);
                    router.push('/home');
                } else {
                    console.error('Role inválida:', role);
                }
            } else {
                console.error('Falha ao decodificar o token');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Login error:', error.message);
            } else {
                console.error('Unknown error occurred during login');
            }
            throw new Error('Problema de conexão');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar o AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
