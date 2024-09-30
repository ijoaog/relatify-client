import dotenv from 'dotenv';
dotenv.config();

export const loadEnvVariables = () => {
    return {
        BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
        JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
        BEARER_TOKEN: process.env.NEXT_PUBLIC_BEARER_TOKEN,
    };
};

export default loadEnvVariables;