'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

// Defina o tipo das props
interface PieChartsProps {
    activeBracelets: number;
    removedBracelets: number;
    violatedBracelets: number;
}

// Componente ajustado com as props tipadas
export function PieChartsComponent({
    activeBracelets,
    removedBracelets,
    violatedBracelets,
}: PieChartsProps) {
    // Criação dinâmica dos dados do gráfico com base nas props
    const chartData = [
        {
            typeSituationName: 'Ativo',
            visitors: activeBracelets,
            fill: 'var(--color-ativo)',
        },
        {
            typeSituationName: 'Removido',
            visitors: removedBracelets,
            fill: 'var(--color-removido)',
        },
        {
            typeSituationName: 'Violado',
            visitors: violatedBracelets,
            fill: 'var(--color-violado)',
        },
    ];

    const chartConfig = {
        visitors: {
            label: 'Visitors',
        },
        ativo: {
            label: 'Ativo',
            color: '#22c55e',
        },
        removido: {
            label: 'Removido',
            color: '#6b7280',
        },
        violado: {
            label: 'Violado',
            color: '#ef4444',
        },
    } satisfies ChartConfig;

    return (
        <Card className='flex flex-col'>
            <CardHeader className='items-center pb-0'>
                <CardTitle>Gráfico</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className='flex-1 pb-0'>
                <ChartContainer
                    config={chartConfig}
                    className='mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground'
                >
                    <PieChart width={250} height={250}>
                        {' '}
                        <ChartTooltip
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey='visitors'
                            label
                            nameKey='typeSituationName'
                            cx='50%' // Centraliza o gráfico
                            cy='50%' // Centraliza o gráfico
                            innerRadius={30} // Raio interno para um gráfico em donut (opcional)
                            outerRadius={80} // Raio externo
                            labelLine={false} // Remove as linhas de rótulo
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className='flex-col gap-2 text-sm'>
                <div className='leading-none text-muted-foreground'>
                    Estatísticas das tornozeleiras.
                </div>
            </CardFooter>
        </Card>
    );
}
