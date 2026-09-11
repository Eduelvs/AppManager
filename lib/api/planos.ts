import { api } from './client';
import { mapPlanoToGoal } from './mappers';
import type { PlanoAnoDto, PlanoAnoMesDto, PlanoDto } from './types';
import type { Goal } from '@/lib/finance';

export async function fetchGoals(): Promise<Goal[]> {
  const planos = await api.get<PlanoDto[]>('/planos');
  return planos.map(mapPlanoToGoal);
}

export function createPlano(nome: string) {
  return api.post<PlanoDto>('/planos', { nome });
}

export function updatePlano(id: string, nome: string) {
  return api.patch<PlanoDto>(`/planos/${id}`, { nome });
}

export function deletePlano(id: string) {
  return api.delete(`/planos/${id}`);
}

export function createPlanoAno(input: {
  id_plan: string;
  ano: number;
  valor_mensal: number;
  taxa: number;
}) {
  return api.post<PlanoAnoDto>('/plano-anos', input);
}

export function updatePlanoAno(
  id: string,
  input: { ano?: number; valor_mensal?: number; taxa?: number },
) {
  return api.patch<PlanoAnoDto>(`/plano-anos/${id}`, input);
}

export function deletePlanoAno(id: string) {
  return api.delete(`/plano-anos/${id}`);
}

export function createPlanoAnoMes(input: {
  id_plano_ano: string;
  valor: number;
  mes: number;
}) {
  return api.post<PlanoAnoMesDto>('/plano-ano-meses', input);
}

export function updatePlanoAnoMes(id: string, input: { valor?: number; mes?: number }) {
  return api.patch<PlanoAnoMesDto>(`/plano-ano-meses/${id}`, input);
}
