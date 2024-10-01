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
    props?: string;
    clickable?: boolean; // Nova prop para controle de clicabilidade
}

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    description,
    count,
    details,
    icon,
    props,
    clickable = true, // Define como true por padrão
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        if (clickable) {
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Card
                className={`h-full w-full transform p-2 transition-all duration-300 ease-in-out sm:w-auto ${clickable ? 'cursor-pointer hover:scale-105 hover:bg-gray-100 hover:shadow-lg' : ''}`}
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
                    </div>
                    <CardDescription className='flex select-none justify-center'>
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className='bottom-0 text-base font-bold sm:text-lg'>
                        {count}
                    </p>
                </CardContent>
            </Card>

            {isModalOpen && <Modal onClose={handleCloseModal}>{details}</Modal>}
        </>
    );
};

export default InfoCard;
