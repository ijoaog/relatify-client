// components/custom/Modal.tsx
import React from 'react';

interface ModalProps {
    onClose: () => void; // Define o tipo para onClose como uma função que não recebe parâmetros e não retorna nada
    children: React.ReactNode; // Define children como um nó React (pode ser qualquer coisa que pode ser renderizada)
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
            <div className='bg-white rounded-lg shadow-lg p-6 max-w-md w-full'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-lg font-bold'>Detalhes</h2>
                    <button onClick={onClose} className='text-gray-600 hover:text-gray-900'>
                        &times;
                    </button>
                </div>
                <div className='mt-4'>
                    {children}
                </div>
                <div className='mt-6 flex justify-end '>
                    <button 
                        onClick={onClose} 
                        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
