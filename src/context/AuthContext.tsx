'use client'; // Necessário para usar hooks no Next.js
import { User, AuthContextType } from '../context/authTypes'; // Importando as interfaces
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import { useRouter } from 'next/navigation'; // Importando useRouter
import { decodeToken } from '../utils/jwtUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null); // Inicializa o estado do usuário como null
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const router = useRouter(); // Inicializa o router
    // Verificação de autenticação em cada renderização
    useEffect(() => {
        if (!loading && !user) {
            router.push('/'); // Redireciona para a página inicial se não estiver logado
        }
    }, [loading, user, router]); // Dependências incluem loading e user
    // Função para carregar o usuário a partir do token armazenado
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            decodeToken(token)
                .then((decoded) => {
                    if (decoded) {
                        const role = decoded.role as User['role']; // Assegura que a role é um tipo válido

                        // Verifica se a role é válida
                        if (role === 'admin' || role === 'user') {
                            const loggedInUser: User = {
                                token,
                                username: decoded.username,
                                role,
                                userlogin: decoded.userlogin, // Adicione isso se necessário
                                email: decoded.email, // Adicione isso se necessário
                            };
                            setUser(loggedInUser);
                        } else {
                            console.error('Role inválida:', role);
                        }
                    } else {
                        console.error('Failed to decode token');
                    }
                    setLoading(false); // Define o carregamento como falso após a verificação do token
                })
                .catch((error) => {
                    console.error('Error decoding token:', error);
                    setLoading(false); // Define o carregamento como falso mesmo em caso de erro
                });
        } else {
            setLoading(false); // Define o carregamento como falso se não houver token
        }
    }, []);

    const login = async (username: string, password: string) => {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            // let errorData = await response.json();
            throw new Error(data.message || 'Login failed');
        }

        localStorage.setItem('token', data.access_token);
        const decoded = await decodeToken(data.access_token);

        if (decoded) {
            const role = decoded.role as User['role']; // Assegura que a role é um tipo válido
            if (role) {
                const loggedInUser: User = {
                    token: data.access_token,
                    username: decoded.username,
                    role,
                    userlogin: decoded.userlogin, // Adicione isso se necessário
                    email: decoded.email, // Adicione isso se necessário
                };
                setUser(loggedInUser);
                router.push('/home'); // Redireciona para a página /home
            } else {
                console.error('Role inválida:', role);
            }
        } else {
            console.error('Failed to decode token');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/'); // Redireciona para a página inicial após logout
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
