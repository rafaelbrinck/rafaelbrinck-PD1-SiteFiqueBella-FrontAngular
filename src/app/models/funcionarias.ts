import { Servico } from './servicos';

export class Funcionaria {
  funcionario_id?: string;
  nome?: string;
  sobrenome?: string;
  email?: string;
  telefone?: string;
  especialidades: string[] = [];
  servicos?: Servico[] = [];
  created_at?: Date;
  updated_at?: Date;
}
