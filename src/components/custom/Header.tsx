// src/components/custom/Header.tsx
'use client'; // Certifique-se de que é um componente do lado do cliente
import React from 'react';
import { Button } from './../ui/button';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons/faArrowRightFromBracket';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    if (!user) return null;

    return (
        <header className='flex items-center bg-gray-800 p-4 text-center text-white'>
            <div className='flex w-1/4 justify-start'>
                <Button className='rounded bg-gray-600 md:hidden flex px-2 py-2 font-bold text-white hover:bg-gray-700'>
                    <FontAwesomeIcon icon={faBars} />
                </Button>
            </div>
            <div className='flex flex-grow justify-center'>
                <h1 className='text-xl'>Relatify</h1>
            </div>
            <div className='flex w-1/4 items-center justify-end'>
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
