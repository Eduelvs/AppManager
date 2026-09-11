import type { Goal } from '@/lib/finance';
import type { YearPlan } from '@/lib/finance';

import type { PlanoAnoDto, PlanoDto } from './types';

export function mapPlanoToGoal(plano: PlanoDto): Goal {
  const years: Record<number, YearPlan> = {};
  for (const ano of plano.anos ?? []) {
    years[ano.ano] = mapAnoToYearPlan(ano);
  }
  return { id: plano.id, name: plano.nome, years };
}

export function mapAnoToYearPlan(ano: PlanoAnoDto): YearPlan {
  const actuals: Record<number, number> = {};
  const monthIds: Record<number, string> = {};
  for (const mes of ano.meses ?? []) {
    const index = mes.mes - 1;
    actuals[index] = Number(mes.valor);
    monthIds[index] = mes.id;
  }
  return {
    id: ano.id,
    year: ano.ano,
    monthlyContribution: Number(ano.valor_mensal),
    annualRate: Number(ano.taxa),
    actuals,
    monthIds,
  };
}
