export interface User {
    role: 'admin' | 'user';
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
  }
  