import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@/services/queries/useGetUsers';
import { GraduationCap } from 'lucide-react';
import { useMemo } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type ChartSlice = {
  key: 'ESCOLA_PARTICULAR' | 'ESCOLA_GRATUITA' | 'NAO_CLASSIFICADO';
  name: string;
  value: number;
  color: string;
};

interface TipoAlunoChartProps {
  /** Lista de usuários (já filtrada ou completa, depende do contexto). */
  users: User[];
}

/**
 * Dashboard que mostra a distribuição dos alunos por tipo de escola.
 *
 * Usa donut chart (Recharts) com 3 categorias:
 * - ESCOLA_PARTICULAR (âmbar — bate com o badge na tabela)
 * - ESCOLA_GRATUITA (esmeralda — bate com o badge na tabela)
 * - NAO_CLASSIFICADO (cinza — os 194 alunos legados sem classificação)
 *
 * O componente filtra apenas alunos (roleName === 'ROLE_USER') — Gestores nunca entram
 * na contagem. Se não houver alunos, mostra um placeholder.
 */
export function TipoAlunoChart({ users }: TipoAlunoChartProps) {
  const { data, total } = useMemo(() => {
    let particular = 0;
    let gratuita = 0;
    let naoClassificado = 0;

    for (const user of users) {
      if (user.roleName !== 'ROLE_USER') continue;
      if (user.tipoAluno === 'ESCOLA_PARTICULAR') particular++;
      else if (user.tipoAluno === 'ESCOLA_GRATUITA') gratuita++;
      else naoClassificado++;
    }

    const slices: ChartSlice[] = [
      {
        key: 'ESCOLA_PARTICULAR',
        name: 'Escola Particular',
        value: particular,
        color: '#f59e0b', // amber-500
      },
      {
        key: 'ESCOLA_GRATUITA',
        name: 'Escola Gratuita',
        value: gratuita,
        color: '#10b981', // emerald-500
      },
      {
        key: 'NAO_CLASSIFICADO',
        name: 'Não classificado',
        value: naoClassificado,
        color: '#9ca3af', // gray-400
      },
    ];

    return {
      data: slices.filter((s) => s.value > 0),
      total: particular + gratuita + naoClassificado,
    };
  }, [users]);

  const percentageOf = (value: number) => (total > 0 ? (value / total) * 100 : 0);

  return (
    <Card className="bg-white shadow-sm rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-blue-600" />
          Distribuição por Tipo de Aluno
        </CardTitle>
        <span className="text-xs text-muted-foreground">
          {total} aluno{total === 1 ? '' : 's'} no total
        </span>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Nenhum aluno para exibir no gráfico.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Donut chart */}
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    isAnimationActive
                  >
                    {data.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} stroke="white" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => {
                      const num = typeof value === 'number' ? value : Number(value) || 0;
                      return [
                        `${num} (${percentageOf(num).toFixed(1)}%)`,
                        String(name),
                      ];
                    }}
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                      fontSize: 13,
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Lista resumo (legenda secundária com números e percentuais) */}
            <ul className="space-y-3">
              {[
                { key: 'ESCOLA_PARTICULAR', label: 'Particular', color: '#f59e0b' },
                { key: 'ESCOLA_GRATUITA', label: 'Gratuita', color: '#10b981' },
                { key: 'NAO_CLASSIFICADO', label: 'Não classificado', color: '#9ca3af' },
              ].map((item) => {
                const slice = data.find((s) => s.key === item.key);
                const value = slice?.value ?? 0;
                const pct = percentageOf(value);
                return (
                  <li
                    key={item.key}
                    className="flex items-center justify-between gap-3 p-2 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{value}</div>
                      <div className="text-xs text-muted-foreground">{pct.toFixed(1)}%</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
