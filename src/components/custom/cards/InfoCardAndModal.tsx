// components/custom/InfoCard.tsx
import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'; // Importa IconProp
import Modal from '../Modal';

interface InfoCardProps {
    title: string;
    description: string;
    count: number;
    details: React.ReactNode;
    icon: IconProp;
    props?: string
}

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    description,
    count,
    details,
    icon,
    props,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Card
                className='h-auto w-full transform cursor-pointer p-2 sm:w-auto transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 hover:shadow-lg'
                onClick={handleOpenModal}
            >
                <CardHeader>
                    <div
                        className={`flex select-none flex-row items-center justify-between gap-2 ${props}`}
                    >
                        <CardTitle className='labelTitle text-lg font-extrabold text-gray-600 sm:text-xl'>
                            {title}
                        </CardTitle>
                        <FontAwesomeIcon
                            className='flex text-2xl'
                            icon={icon}
                        />{' '}
                        {/* Usando o ícone dinâmico */}
                    </div>
                    <CardDescription className='select-none'>
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className='text-base font-bold sm:text-lg bottom-0'>{count}</p>
                </CardContent>
            </Card>

            {isModalOpen && <Modal onClose={handleCloseModal}>{details}</Modal>}
        </>
    );
};

export default InfoCard;
