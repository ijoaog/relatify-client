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
        const checkToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = await decodeToken(token);
                    if (decoded) {
                        const role = decoded.role as User['role'];
                        if (role === 'admin' || role === 'user') {
                            const loggedInUser: User = {
                                token,
                                username: decoded.username,
                                role,
                                userlogin: decoded.userlogin,
                                email: decoded.email,
                            };
                            setUser(loggedInUser);
                            if (!user) {
                                router.push('/home');
                            }
                        } else {
                            console.error('Role inválida:', role);
                        }
                    } else {
                        console.error('Failed to decode token');
                    }
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        console.error('Error decoding token:', error.message);
                    } else {
                        console.error('Unknown error occurred during token decoding');
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        checkToken();
    }, [router, user]);
    const login = async (username: string, password: string) => {
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Usuário ou senha inválidos.'
                );
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);

            const decoded = await decodeToken(data.access_token);

            if (decoded) {
                const role = decoded.role as User['role'];
                if (role === 'admin' || role === 'user') {
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
            setUser(null); // Limpar o estado do usuário em caso de erro
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};