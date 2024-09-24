'use client';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import  Loader from '../../components/custom/Loader';

const AdminPage = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Estado de carregamento

    useEffect(() => {
        if (!user) {
            router.push('/home');
        } else if (user.role !== 'admin') {
            router.push('/home');
        } else {
            setLoading(false); // Define loading como false se o usuário for admin
        }
    }, [user, router]);

    if (loading) {
        return (
            <div className='mainContainer flex justify-center items-center h-screen'>
                <Loader/>
            </div>
        );
    }

    return (
        <div>
            <h1>Admin Page</h1>
            <p>Conteúdo restrito para administradores.</p>
        </div>
    );
};

export default AdminPage;
