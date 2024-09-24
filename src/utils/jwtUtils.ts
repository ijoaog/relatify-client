import jwt from 'jsonwebtoken';

// Interface para o token decodificado
interface DecodedToken {
    exp: number;
    iat: number;
    sub: string;
    username: string;
    userlogin: string;
    email: string;
    role: string; 
}

export const decodeToken = (token: string): Promise<DecodedToken | null> => {
    return new Promise((resolve) => {
        if (typeof token !== 'string' || token.trim() === '') {
            console.error('Token inválido: deve ser uma string não vazia.');
            resolve(null);
            return;
        }

        const decoded = jwt.decode(token) as DecodedToken;
        if (decoded) {
            resolve(decoded);
        } else {
            console.error('Erro ao decodificar o token: resultado vazio.');
            resolve(null);
        }
    });
};