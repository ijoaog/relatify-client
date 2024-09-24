export interface User {
    token: string;
    username: string;
    role: 'admin' | 'user'; // Ajuste conforme necessário
    userlogin?: string; // Se necessário
    email?: string; // Se necessário
}

export interface AuthContextType {
    user: User | null;
    loading: boolean; // Adicione esta linha
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}
