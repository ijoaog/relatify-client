// src/components/custom/Header.tsx
'use client'; // Certifique-se de que é um componente do lado do cliente
import React from 'react';
import { Button } from './../ui/button';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons/faArrowRightFromBracket';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    if (!user) return null;

    return (
        <header className='flex items-center justify-between bg-gray-800 p-4 text-white text-center'>
            <h1 className='text-xl'>Relatify</h1>
            <div>
                <span>{`${user.username}`}</span>
                <Button
                    onClick={logout}
                    className='ml-4 rounded bg-red-500 px-2 py-2 font-bold text-white hover:bg-red-700'
                >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </Button>
            </div>
        </header>
    );
};

export default Header;
