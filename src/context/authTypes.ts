// src/context/authTypes.ts
export interface User {
    token: string;
    name: string;
    role: 'admin' | 'official_agent'; // ou outro tipo que você esteja usando
    username: string;
    email: string;
}

export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    isSheetOpen: boolean; // Adicionando isSheetOpen
    openSheet: () => void; // Adicionando openSheet
    closeSheet: () => void; // Adicionando closeSheet
}
