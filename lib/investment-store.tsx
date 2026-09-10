import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { YearPlan } from './finance';


const STORAGE_KEY = '@meu-app/investment-plans/v1';

type PlansByYear = Record<number, YearPlan>;

type InvestmentContextValue = {
  hydrated: boolean;
  plans: PlansByYear;
  planList: YearPlan[];
  getPlan: (year: number) => YearPlan | undefined;
  upsertPlan: (input: {
    year: number;
    monthlyContribution: number;
    annualRate: number;
  }) => void;
  setActual: (year: number, month: number, amount: number) => void;
  removePlan: (year: number) => void;
};

const InvestmentContext = createContext<InvestmentContextValue | null>(null);

export function InvestmentProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState<PlansByYear>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (active && raw) setPlans(JSON.parse(raw) as PlansByYear);
      } catch {
      } finally {
        if (active) setHydrated(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plans)).catch(() => {});
  }, [plans, hydrated]);

  const upsertPlan = useCallback<InvestmentContextValue['upsertPlan']>((input) => {
    setPlans((prev) => {
      const existing = prev[input.year];
      return {
        ...prev,
        [input.year]: {
          year: input.year,
          monthlyContribution: input.monthlyContribution,
          annualRate: input.annualRate,
          actuals: existing?.actuals ?? {},
        },
      };
    });
  }, []);

  const setActual = useCallback<InvestmentContextValue['setActual']>((year, month, amount) => {
    setPlans((prev) => {
      const existing = prev[year] ?? {
        year,
        monthlyContribution: 0,
        annualRate: 0,
        actuals: {} as Record<number, number>,
      };
      return {
        ...prev,
        [year]: {
          ...existing,
          actuals: { ...existing.actuals, [month]: amount },
        },
      };
    });
  }, []);

  const removePlan = useCallback<InvestmentContextValue['removePlan']>((year) => {
    setPlans((prev) => {
      const next = { ...prev };
      delete next[year];
      return next;
    });
  }, []);

  const value = useMemo<InvestmentContextValue>(() => {
    const planList = Object.values(plans).sort((a, b) => a.year - b.year);
    return {
      hydrated,
      plans,
      planList,
      getPlan: (year) => plans[year],
      upsertPlan,
      setActual,
      removePlan,
    };
  }, [plans, hydrated, upsertPlan, setActual, removePlan]);

  return <InvestmentContext.Provider value={value}>{children}</InvestmentContext.Provider>;
}

export function useInvestments(): InvestmentContextValue {
  const ctx = useContext(InvestmentContext);
  if (!ctx) throw new Error('useInvestments deve ser usado dentro de <InvestmentProvider>.');
  return ctx;
}
