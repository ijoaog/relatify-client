'use client';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../../components/custom/Loader';
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Select,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { toast } from 'sonner'; // Importando a função de toast
import loadEnvVariables from '@/configs/centralConfigs';

const RegisterPage = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const form = useForm({
        defaultValues: {
            name: '',
            cpf: '',
            email: '',
            state: 'Paraná',
            comarca: 'Curitiba',
        },
    });

    interface IRegisterForm {
        name: string;
        cpf: string;
        email: string;
        state: string;
        comarca: string;
    }

    useEffect(() => {
        if (authLoading) return;
        if (!user || user.role !== 'admin') {
            router.push('/home');
        }
    }, [user, authLoading, router]);

    const envVariables = loadEnvVariables();

    const handleSubmit = async (userData: IRegisterForm) => {
        setLoading(true);
        try {
            const response = await fetch(`${envVariables.BACKEND_URL}/users`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${envVariables.BEARER_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                if (response.status === 409) {
                    toast.error(`Erro no Registro:`, {
                        description: 'Usuário já existe',
                        duration: 5000,
                        position: 'bottom-right',
                        style: {
                            borderRadius: '8px',
                            fontSize: '16px',
                        },
                    });
                    return;
                }
            }

            toast.success(`Usuário criado com sucesso!`, {
                description: 'Os dados foram enviados para o email fornecido.',
                duration: 5000,
                position: 'bottom-right',
                style: {
                    borderRadius: '8px',
                    fontSize: '16px',
                },
            });
        } catch (error) {
            console.log('Error:', error);
            console.error(error);
            toast.error('Não foi possível criar o usuário: ' + error); // Exibindo toaster de erro
        } finally {
            setLoading(false); // Certifique-se de sempre parar o carregamento
        }
    };

    if (authLoading) {
        return (
            <div className='mainContainer flex h-screen items-center justify-center'>
                <Loader />
            </div>
        );
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-4 text-2xl font-bold'>Registros</h1>
            <p className='mb-8'>Esta é a página de registros do nosso site.</p>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='space-y-6'
                >
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        {/* Nome Completo */}
                        <FormField
                            control={form.control}
                            name='name'
                            rules={{
                                required: 'Nome completo é obrigatório',
                                minLength: {
                                    value: 3,
                                    message:
                                        'O nome deve ter pelo menos 3 caracteres',
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome Completo</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Digite o nome completo'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Insira o nome completo do usuário.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* CPF */}
                        <FormField
                            control={form.control}
                            name='cpf'
                            rules={{
                                required: 'CPF é obrigatório',
                                validate: {
                                    isComplete: (value) =>
                                        value.replace(/\D/g, '').length ===
                                            11 || 'CPF deve conter 11 números',
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CPF</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={11} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <span className='font-extrabold'>
                                                .
                                            </span>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                            <span className='font-extrabold'>
                                                .
                                            </span>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={6} />
                                                <InputOTPSlot index={7} />
                                                <InputOTPSlot index={8} />
                                            </InputOTPGroup>
                                            <span className='font-extrabold'>
                                                -
                                            </span>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={9} />
                                                <InputOTPSlot index={10} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormDescription>
                                        Insira o CPF do usuário.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='email'
                                            placeholder='Digite o email'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Insira o email do usuário.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Estado */}
                        <FormField
                            control={form.control}
                            name='state'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder='Selecione o estado' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Paraná'>
                                                    Paraná
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        Selecione o estado de atuação.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        {/* Comarca */}
                        <FormField
                            control={form.control}
                            name='comarca'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comarca</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder='Selecione a comarca' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Curitiba'>
                                                    Curitiba
                                                </SelectItem>
                                                <SelectItem value='Antonina'>
                                                    Antonina
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        Selecione a comarca de atuação.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Botão de Submissão */}
                    <div className='flex justify-center'>
                        <Button
                            type='submit'
                            className='w-full md:w-1/3'
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader height={20} width={20} />
                            ) : (
                                'Registrar'
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default RegisterPage;
