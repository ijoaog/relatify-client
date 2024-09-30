// src/components/custom/Header.tsx
'use client'; // Certifique-se de que é um componente do lado do cliente
import React from 'react';
import { Button } from './../ui/button';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons/faArrowRightFromBracket';
import { SheetSideBar } from './SheetSideBar';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    if (!user) return null; // Verifica se o usuário está autenticado

    return (
        <header className='flex h-16 items-center bg-gray-800 p-4 text-white'>
            <div className='flex w-1/4 justify-start'>
                <div className='sm:hidden'>
                    <SheetSideBar />
                </div>
            </div>
            <div className='flex flex-grow justify-center'>
                <h1 className='text-xl'>Relatify</h1>{' '}
                {/* Título centralizado */}
            </div>
            <div className='flex w-1/4 items-center justify-end'>
                <span>{`${user.username}`}</span> {/* Nome do usuário */}
                <Button
                    onClick={logout}
                    className='ml-4 hidden rounded bg-red-500 px-2 py-2 font-bold text-white hover:bg-red-700 sm:flex'
                >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </Button>
            </div>
        </header>
    );
};

export default Header;
