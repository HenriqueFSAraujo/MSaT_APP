import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, BadgeCheck } from 'lucide-react';

interface MetricsProps {
    metrics: {
        totalAlunos: number;
        // alunosAtivos: number;
        totalGestores: number;
        // percentageAtivos: number;
    };
}

export function UsersMetricsCards({ metrics }: MetricsProps) {
    return (
        <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalAlunos}</div>
                    {/* <p className="text-xs text-muted-foreground">
                        {metrics.totalAlunos > 0 ? `${metrics.percentageAtivos}% ativos` : 'Nenhum aluno cadastrado'}
                    </p> */}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {/* <div className="text-2xl font-bold">{metrics.alunosAtivos}</div> */}
                    <p className="text-xs text-muted-foreground">
                        De um total de {metrics.totalAlunos} alunos
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bolsas aprovadas</CardTitle>
                    <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+400</div>
                </CardContent>
            </Card>
        </div>
    );
} 