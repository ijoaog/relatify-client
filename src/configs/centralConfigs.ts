import dotenv from 'dotenv';
dotenv.config();

export const loadEnvVariables = () => {
    return {
        BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
        JWT_SECRET: process.env.JWT_SECRET,
    };
};