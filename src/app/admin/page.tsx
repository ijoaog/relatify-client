'use client'; // Marque esta página como um componente do lado do cliente
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/'); // Redireciona se não for admin
    }
  }, [user, router]);

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Conteúdo restrito para administradores.</p>
    </div>
  );
};

export default AdminPage;
