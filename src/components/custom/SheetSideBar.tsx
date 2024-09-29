'use client';
import { useAuth } from '@/context/AuthContext';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons/faArrowRightFromBracket';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Label } from '../ui/label';
import { User } from '@/context/authTypes';

export const SheetSideBar = () => {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const navItems = [
        { label: 'Home', href: '/home', role: 'official_agent' },
        { label: 'Administrador', href: '/admin', role: 'admin' },
        { label: 'Relatórios', href: '/reports', role: 'official_agent' },
        { label: 'Sobre', href: '/about', role: 'official_agent' },
    ];

    if (!user) return null;

    const filteredNavItems = navItems.filter(
        (item) => user.role as User['role'] === 'admin' || item.role as User['role'] === 'official_agent'
    );
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleLinkClick = () => {
        handleClose();
    };

    return (
        <div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        className='border-none bg-black px-4 text-white'
                        variant='outline'
                        onClick={handleOpen} // Abre o Sheet ao clicar no botão
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side='left'
                    className='flex h-full border-none bg-gray-600'
                >
                    <div className='sheetContainer flex w-full flex-col bg-gray-600 p-4 text-white justify-between'>
                        <div className='menu flex flex-col'>
                            <h2 className='mb-6 text-2xl font-bold'>Menu</h2>
                            <ul className='space-y-2'>
                                {filteredNavItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={handleLinkClick}
                                        >
                                            <div
                                                className={`block w-auto rounded px-4 py-2 transition-colors duration-200 ${
                                                    pathname === item.href
                                                        ? 'bg-gray-900'
                                                        : 'hover:bg-gray-800'
                                                }`}
                                            >
                                                {item.label}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='bottomButton gap-2 items-center justify-center text-center'>
                            <Button
                                onClick={logout}
                                className='ml-4 rounded bg-red-500 px-2 py-2 font-bold text-white hover:bg-red-700'
                            >
                                <FontAwesomeIcon
                                    icon={faArrowRightFromBracket}
                                />
                                <Label>Logout</Label>
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};
