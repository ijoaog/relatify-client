'use client';

import { TrendingDown } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

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

export const description = 'A line chart with dots';

const chartData = [
    { month: 'Janeiro', alerts: 186 },
    { month: 'Fevereiro', alerts: 305 },
    { month: 'Março', alerts: 237 },
    { month: 'abril', alerts: 73 },
    { month: 'Maio', alerts: 209 },
    { month: 'Junho', alerts: 214 },
];

const chartConfig = {
    alerts: {
        label: 'Alerta',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

export function LineChartsComponent() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Alertas no Ano</CardTitle>
                <CardDescription>Janeiro - Junho 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey='month'
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey='alerts'
                            type='natural'
                            stroke='var(--color-alerts)'
                            strokeWidth={2}
                            dot={{
                                fill: 'var(--color-alerts)',
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className='flex-col items-center justify-center gap-2 text-sm'>
                <div className='flex justify-center gap-2 font-medium leading-none'>
                    Houve uma queda em relação ao ano anterior.{' '}
                    <TrendingDown className='h-4 w-4' />
                </div>
                <div className='leading-none text-muted-foreground'>
                    Alertas mensais de 2024.
                </div>
            </CardFooter>
        </Card>
    );
}
