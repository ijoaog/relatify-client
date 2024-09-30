'use client';
import { User, AuthContextType } from '../context/authTypes';
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
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

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    }, [router]); // logout é memorizado e não será recriado em cada renderização

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
                    logout(); // Agora chama a função logout memorizada
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        checkToken();
    }, [router, logout]); // logout é agora uma dependência válida

    const login = async (username: string, password: string) => {
        const envVariables = loadEnvVariables();
        console.log("eieie",envVariables.BACKEND_URL);
        
        try {
            const response = await fetch(
                `${envVariables.BACKEND_URL}/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${envVariables.BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log('error', errorData.message);

                setUser(null);
                throw new Error(errorData.message);
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            const decoded = await decodeToken(data.access_token);
            console.log('Decoded Token:', decoded);

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
        } catch (error: unknown) {
            if (error instanceof TypeError) {
                console.error('Problema de conexão:', error.message);
                throw new Error('Problema de conexão');
            } else if (error instanceof Error) {
                console.error('Erro durante o login:', error.message);
                setUser(null);
                throw new Error(error.message);
            } else {
                console.error('Erro desconhecido durante o login');
                setUser(null);
                throw new Error('Erro desconhecido');
            }
        }
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
