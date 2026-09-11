export type ApiUser = {
  id: string;
  email: string;
};

export type AuthResponse = {
  access_token: string;
  user: ApiUser;
};

export type PlanoAnoMesDto = {
  id: string;
  id_plano_ano: string;
  valor: number;
  mes: number;
};

export type PlanoAnoDto = {
  id: string;
  ano: number;
  valor_mensal: number;
  taxa: number;
  id_plan: string;
  meses?: PlanoAnoMesDto[];
};

export type PlanoDto = {
  id: string;
  nome: string;
  id_user: string;
  anos?: PlanoAnoDto[];
};
