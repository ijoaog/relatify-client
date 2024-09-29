// src/context/AuthContext.tsx

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
import { loadEnvVariables } from '../configs/centralConfigs';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = await decodeToken(token);
                    if (decoded) {
                        const role = decoded.role as User['role'];
                        if (role === 'admin' || role === 'official_agent') {
                            const loggedInUser: User = {
                                token,
                                name: decoded.name,
                                role,
                                username: decoded.username,
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
                } catch (error) {
                    console.error('Error decoding token:', error);
                    logout(); // Logout se o token não puder ser decodificado
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        checkToken();
    }, [router]);

    const login = async (username: string, password: string) => {
        const envVariables = loadEnvVariables(); // Chame a função para obter o objeto
        console.log("sauihasuuas",envVariables.BACKEND_URL); // Agora você pode acessar BACKEND_URL

        try {
            const response = await fetch('http://localhost:3090/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log('error', errorData.message);

                setUser(null);
                throw new Error(errorData.message);
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            const decoded = await decodeToken(data.access_token);
            console.log('Decoded Token:', decoded); // Adicione este log

            if (decoded) {
                const role = decoded.role as User['role'];
                if (role === 'admin' || role === 'official_agent') {
                    const loggedInUser: User = {
                        token: data.access_token,
                        name: decoded.name,
                        role,
                        username: decoded.username,
                        email: decoded.email,
                    };
                    setUser(loggedInUser);
                    router.push('/home');
                } else {
                    console.error('Role inválida:', role);
                    setUser(null);
                }
            } else {
                console.error('Falha ao decodificar o token');
                setUser(null);
            }
        } catch (error: any) {
            if (error instanceof TypeError) {
                console.error('Problema de conexão:', error.message);
                throw new Error('Problema de conexão');
            } else {
                console.error('Erro durante o login:', error.message);
                setUser(null);
                throw new Error(error.message);
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    // Funções para abrir e fechar o Sheet
    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
                isSheetOpen,
                openSheet,
                closeSheet,
            }}
        >
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
