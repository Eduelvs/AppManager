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

export type Goal = {
  id: string;
  name: string;
  years: Record<number, YearPlan>;
};

type PersistedV2 = {
  version: 2;
  goals: Goal[];
  activeGoalId: string | null;
};

type StoreState = {
  goals: Goal[];
  activeGoalId: string | null;
};

type InvestmentContextValue = {
  hydrated: boolean;
  goals: Goal[];
  activeGoal: Goal | null;
  activeGoalId: string | null;
  planList: YearPlan[];
  setActiveGoalId: (id: string) => void;
  createGoal: (name: string) => string;
  renameGoal: (id: string, name: string) => void;
  removeGoal: (id: string) => void;
  getPlan: (year: number, goalId?: string) => YearPlan | undefined;
  upsertPlan: (input: {
    year: number;
    monthlyContribution: number;
    annualRate: number;
    goalId?: string;
    actuals?: Record<number, number>;
  }) => void;
  setActual: (year: number, month: number, amount: number, goalId?: string) => void;
  removePlan: (year: number, goalId?: string) => void;
};

const InvestmentContext = createContext<InvestmentContextValue | null>(null);

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function isYearPlan(value: unknown): value is YearPlan {
  if (!value || typeof value !== 'object') return false;
  const item = value as YearPlan;
  return typeof item.year === 'number' && typeof item.monthlyContribution === 'number';
}

function migrate(raw: unknown): StoreState {
  if (!raw || typeof raw !== 'object') {
    return { goals: [], activeGoalId: null };
  }

  const obj = raw as Record<string, unknown>;

  if (obj.version === 2 && Array.isArray(obj.goals)) {
    const goals = (obj.goals as Goal[]).filter(
      (g) => g && typeof g.id === 'string' && typeof g.name === 'string' && g.years
    );
    const activeGoalId =
      typeof obj.activeGoalId === 'string' && goals.some((g) => g.id === obj.activeGoalId)
        ? obj.activeGoalId
        : (goals[0]?.id ?? null);
    return { goals, activeGoalId };
  }

  const years: Record<number, YearPlan> = {};
  for (const value of Object.values(obj)) {
    if (isYearPlan(value)) years[value.year] = value;
  }

  if (Object.keys(years).length === 0) {
    return { goals: [], activeGoalId: null };
  }

  const id = createId();
  return {
    goals: [{ id, name: 'Meu Plano', years }],
    activeGoalId: id,
  };
}

function resolveGoalId(state: StoreState, goalId?: string): string | null {
  if (goalId && state.goals.some((g) => g.id === goalId)) return goalId;
  return state.activeGoalId;
}

export function InvestmentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>({ goals: [], activeGoalId: null });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (active && raw) setState(migrate(JSON.parse(raw)));
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
    const payload: PersistedV2 = {
      version: 2,
      goals: state.goals,
      activeGoalId: state.activeGoalId,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => {});
  }, [state, hydrated]);

  const setActiveGoalId = useCallback((id: string) => {
    setState((prev) => {
      if (!prev.goals.some((g) => g.id === id)) return prev;
      return { ...prev, activeGoalId: id };
    });
  }, []);

  const createGoal = useCallback((name: string) => {
    const id = createId();
    const trimmed = name.trim() || 'Novo plano';
    setState((prev) => ({
      goals: [...prev.goals, { id, name: trimmed, years: {} }],
      activeGoalId: id,
    }));
    return id;
  }, []);

  const renameGoal = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, name: trimmed } : g)),
    }));
  }, []);

  const removeGoal = useCallback((id: string) => {
    setState((prev) => {
      const goals = prev.goals.filter((g) => g.id !== id);
      const activeGoalId =
        prev.activeGoalId === id ? (goals[0]?.id ?? null) : prev.activeGoalId;
      return { goals, activeGoalId };
    });
  }, []);

  const upsertPlan = useCallback<InvestmentContextValue['upsertPlan']>((input) => {
    setState((prev) => {
      const goalId = resolveGoalId(prev, input.goalId);
      if (!goalId) return prev;
      return {
        ...prev,
        goals: prev.goals.map((g) => {
          if (g.id !== goalId) return g;
          const existing = g.years[input.year];
          return {
            ...g,
            years: {
              ...g.years,
              [input.year]: {
                year: input.year,
                monthlyContribution: input.monthlyContribution,
                annualRate: input.annualRate,
                actuals: input.actuals ?? existing?.actuals ?? {},
              },
            },
          };
        }),
      };
    });
  }, []);

  const setActual = useCallback<InvestmentContextValue['setActual']>(
    (year, month, amount, goalId) => {
      setState((prev) => {
        const id = resolveGoalId(prev, goalId);
        if (!id) return prev;
        return {
          ...prev,
          goals: prev.goals.map((g) => {
            if (g.id !== id) return g;
            const existing = g.years[year] ?? {
              year,
              monthlyContribution: 0,
              annualRate: 0,
              actuals: {} as Record<number, number>,
            };
            return {
              ...g,
              years: {
                ...g.years,
                [year]: {
                  ...existing,
                  actuals: { ...existing.actuals, [month]: amount },
                },
              },
            };
          }),
        };
      });
    },
    []
  );

  const removePlan = useCallback<InvestmentContextValue['removePlan']>((year, goalId) => {
    setState((prev) => {
      const id = resolveGoalId(prev, goalId);
      if (!id) return prev;
      return {
        ...prev,
        goals: prev.goals.map((g) => {
          if (g.id !== id) return g;
          const years = { ...g.years };
          delete years[year];
          return { ...g, years };
        }),
      };
    });
  }, []);

  const value = useMemo<InvestmentContextValue>(() => {
    const activeGoal = state.goals.find((g) => g.id === state.activeGoalId) ?? null;
    const planList = activeGoal
      ? Object.values(activeGoal.years).sort((a, b) => a.year - b.year)
      : [];

    return {
      hydrated,
      goals: state.goals,
      activeGoal,
      activeGoalId: state.activeGoalId,
      planList,
      setActiveGoalId,
      createGoal,
      renameGoal,
      removeGoal,
      getPlan: (year, goalId) => {
        const goal = goalId
          ? state.goals.find((g) => g.id === goalId)
          : activeGoal;
        return goal?.years[year];
      },
      upsertPlan,
      setActual,
      removePlan,
    };
  }, [
    state,
    hydrated,
    setActiveGoalId,
    createGoal,
    renameGoal,
    removeGoal,
    upsertPlan,
    setActual,
    removePlan,
  ]);

  return <InvestmentContext.Provider value={value}>{children}</InvestmentContext.Provider>;
}

export function useInvestments(): InvestmentContextValue {
  const ctx = useContext(InvestmentContext);
  if (!ctx) throw new Error('useInvestments deve ser usado dentro de <InvestmentProvider>.');
  return ctx;
}
