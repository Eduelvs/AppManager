export type MonthActuals = Record<number, number>;

export type YearPlan = {
  year: number;
  monthlyContribution: number;
  annualRate: number;
  actuals: MonthActuals;
};

export const MONTHS_PT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
] as const;

export const MONTHS_PT_FULL = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const;


export function monthlyRate(annualRatePercent: number): number {
  return annualRatePercent / 100 / 12;
}

export function contributedPrincipal(plan: YearPlan): number {
  return Object.values(plan.actuals).reduce((sum, v) => sum + (v || 0), 0);
}

function chainYears(plans: YearPlan[], pick: (plan: YearPlan, month: number) => number): number {
  const sorted = [...plans].sort((a, b) => a.year - b.year);
  let balance = 0;
  for (const plan of sorted) {
    const i = monthlyRate(plan.annualRate);
    for (let m = 0; m < 12; m++) balance = balance * (1 + i) + pick(plan, m);
  }
  return balance;
}

export function portfolioProjected(plans: YearPlan[]): number {
  return chainYears(plans, (plan) => plan.monthlyContribution);
}

export function projectedThroughYear(plans: YearPlan[], year: number): number {
  const relevant = plans.filter((p) => p.year <= year);
  return chainYears(relevant, (plan) => plan.monthlyContribution);
}

export function realThroughYear(plans: YearPlan[], year: number): number {
  const relevant = plans.filter((p) => p.year <= year);
  return chainYears(relevant, (plan, m) => plan.actuals[m] ?? 0);
}

export function portfolioReal(plans: YearPlan[]): number {
  return chainYears(plans, (plan, m) => plan.actuals[m] ?? 0);
}

export function portfolioMonthlyYield(plans: YearPlan[]): number {
  if (plans.length === 0) return 0;
  const latest = [...plans].sort((a, b) => a.year - b.year)[plans.length - 1];
  return portfolioReal(plans) * monthlyRate(latest.annualRate);
}

export function formatBRL(value: number): string {
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
    }).format(value || 0);
  } catch {
    const fixed = (value || 0).toFixed(2).replace('.', ',');
    return `R$ ${fixed.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  }
}

export function formatBRLCompact(value: number): string {
  const abs = Math.abs(value || 0);
  if (abs >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1).replace('.', ',')} mi`;
  if (abs >= 1_000) return `R$ ${(value / 1_000).toFixed(1).replace('.', ',')} mil`;
  return formatBRL(value);
}
