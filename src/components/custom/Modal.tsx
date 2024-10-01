import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-[90%] max-h-[90%] flex flex-col relative'>
                <button 
                    onClick={onClose} 
                    className='absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition'>
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
                <div className='flex justify-center mb-4'>
                    <h2 className='text-lg font-bold'>Detalhes</h2>
                </div>
                <div className='flex-grow'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
