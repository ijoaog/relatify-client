'use client';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../../components/custom/Loader';

const AdminPage = () => {
    const { user, loading: authLoading } = useAuth(); // Obtém o usuário e o estado de carregamento do contexto
    const router = useRouter();

    useEffect(() => {
        // Se a autenticação estiver carregando, não faz nada
        if (authLoading) {
            return; // Aguarda o carregamento
        }

        console.log('User:', user);

        // Verifica se o usuário está logado
        if (!user) {
            console.log('User not logged in. Redirecting to /home...');
            router.push('/home'); // Redireciona se não houver usuário
        } else if (user.role !== 'admin') {
            console.log('User does not have admin role. Redirecting to /home...');
            router.push('/home'); // Redireciona se a role não for admin
        }else if (user.role === 'admin') {
          router.push('/admin'); // Redireciona se não houver usuário
        }
    }, [user, authLoading, router]);

    // Mostra o loader enquanto a autenticação está sendo processada
    if (authLoading) {
        return (
            <div className='mainContainer flex h-screen items-center justify-center'>
                <Loader />
            </div>
        );
    }

    // Se chegou aqui, significa que o usuário está autenticado e é admin
    return (
        <div>
            <h1>Admin Page</h1>
            <p>Conteúdo restrito para administradores.</p>
        </div>
    );
};

export default AdminPage;