import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Modal from '../Modal';

interface InfoCardProps {
    title: string;
    description: string;
    count: number;
    details: React.ReactNode;
    icon: IconProp;
    props?: string;
    clickable?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    description,
    count,
    details,
    icon,
    props,
    clickable = true,
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
                className={`flex flex-col h-full w-full p-4 transition-all duration-300 ease-in-out sm:w-auto ${
                    clickable ? 'cursor-pointer hover:scale-105 hover:bg-gray-100 hover:shadow-lg' : ''
                }`}
                onClick={handleOpenModal}
            >
                <CardHeader>
                    <div
                        className={`flex items-center justify-between ${props}`}
                    >
                        <CardTitle className='text-lg font-extrabold text-gray-600 sm:text-xl'>
                            {title}
                        </CardTitle>
                        <FontAwesomeIcon
                            className='text-2xl'
                            icon={icon}
                        />
                    </div>
                    <CardDescription className='flex justify-center mt-2'>
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent className='mt-auto'>
                    <p className='text-base font-bold sm:text-lg'>
                        {count}
                    </p>
                </CardContent>
            </Card>

            {isModalOpen && <Modal onClose={handleCloseModal}>{details}</Modal>}
        </>
    );
};

export default InfoCard;