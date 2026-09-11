import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useAuth } from '@/lib/auth';
import type { Goal, YearPlan } from '@/lib/finance';
import {
  createPlano,
  createPlanoAno,
  createPlanoAnoMes,
  deletePlano,
  deletePlanoAno,
  fetchGoals,
  updatePlano,
  updatePlanoAno,
  updatePlanoAnoMes,
} from '@/lib/api/planos';

export type { Goal } from '@/lib/finance';

type InvestmentContextValue = {
  hydrated: boolean;
  isLoading: boolean;
  goals: Goal[];
  activeGoal: Goal | null;
  activeGoalId: string | null;
  planList: YearPlan[];
  setActiveGoalId: (id: string) => void;
  createGoal: (name: string) => Promise<string>;
  renameGoal: (id: string, name: string) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  getPlan: (year: number, goalId?: string) => YearPlan | undefined;
  upsertPlan: (input: {
    year: number;
    monthlyContribution: number;
    annualRate: number;
    goalId?: string;
    planId?: string;
  }) => Promise<void>;
  setActual: (year: number, month: number, amount: number, goalId?: string) => Promise<void>;
  removePlan: (year: number, goalId?: string) => Promise<void>;
};

const InvestmentContext = createContext<InvestmentContextValue | null>(null);

export function InvestmentProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [activeGoalId, setActiveGoalIdState] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['planos'],
    queryFn: fetchGoals,
    enabled: Boolean(token),
  });

  const goals = query.data ?? [];

  useEffect(() => {
    if (goals.length === 0) {
      setActiveGoalIdState(null);
      return;
    }
    if (!activeGoalId || !goals.some((goal) => goal.id === activeGoalId)) {
      setActiveGoalIdState(goals[0].id);
    }
  }, [goals, activeGoalId]);

  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['planos'] }),
    [queryClient],
  );

  const setActiveGoalId = useCallback((id: string) => {
    setActiveGoalIdState(id);
  }, []);

  const createMutation = useMutation({
    mutationFn: (nome: string) => createPlano(nome),
    onSuccess: async (plano) => {
      setActiveGoalIdState(plano.id);
      await invalidate();
    },
  });

  const createGoal = useCallback(
    async (name: string) => {
      const plano = await createMutation.mutateAsync(name.trim() || 'Novo plano');
      return plano.id;
    },
    [createMutation],
  );

  const renameGoal = useCallback(
    async (id: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      await updatePlano(id, trimmed);
      await invalidate();
    },
    [invalidate],
  );

  const removeGoal = useCallback(
    async (id: string) => {
      await deletePlano(id);
      await invalidate();
    },
    [invalidate],
  );

  const getGoal = useCallback(
    (goalId?: string) => {
      if (goalId) return goals.find((goal) => goal.id === goalId);
      return goals.find((goal) => goal.id === activeGoalId) ?? null;
    },
    [goals, activeGoalId],
  );

  const upsertPlan = useCallback(
    async (input: {
      year: number;
      monthlyContribution: number;
      annualRate: number;
      goalId?: string;
      planId?: string;
    }) => {
      const goal = getGoal(input.goalId);
      if (!goal) return;
      if (input.planId) {
        await updatePlanoAno(input.planId, {
          ano: input.year,
          valor_mensal: input.monthlyContribution,
          taxa: input.annualRate,
        });
      } else {
        await createPlanoAno({
          id_plan: goal.id,
          ano: input.year,
          valor_mensal: input.monthlyContribution,
          taxa: input.annualRate,
        });
      }
      await invalidate();
    },
    [getGoal, invalidate],
  );

  const setActual = useCallback(
    async (year: number, month: number, amount: number, goalId?: string) => {
      const goal = getGoal(goalId);
      const plan = goal?.years[year];
      if (!plan?.id) {
        throw new Error('Configure o ano do plano antes de registrar o aporte.');
      }
      const existingId = plan.monthIds?.[month];
      if (existingId) {
        await updatePlanoAnoMes(existingId, { valor: amount });
      } else {
        await createPlanoAnoMes({
          id_plano_ano: plan.id,
          valor: amount,
          mes: month + 1,
        });
      }
      await invalidate();
    },
    [getGoal, invalidate],
  );

  const removePlan = useCallback(
    async (year: number, goalId?: string) => {
      const plan = getGoal(goalId)?.years[year];
      if (!plan?.id) return;
      await deletePlanoAno(plan.id);
      await invalidate();
    },
    [getGoal, invalidate],
  );

  const value = useMemo<InvestmentContextValue>(() => {
    const activeGoal = goals.find((goal) => goal.id === activeGoalId) ?? null;
    const planList = activeGoal
      ? Object.values(activeGoal.years).sort((a, b) => a.year - b.year)
      : [];

    return {
      hydrated: !token || !query.isLoading,
      isLoading: Boolean(token) && query.isLoading,
      goals,
      activeGoal,
      activeGoalId,
      planList,
      setActiveGoalId,
      createGoal,
      renameGoal,
      removeGoal,
      getPlan: (year, goalId) => getGoal(goalId)?.years[year],
      upsertPlan,
      setActual,
      removePlan,
    };
  }, [
    token,
    query.isLoading,
    goals,
    activeGoalId,
    setActiveGoalId,
    createGoal,
    renameGoal,
    removeGoal,
    getGoal,
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
