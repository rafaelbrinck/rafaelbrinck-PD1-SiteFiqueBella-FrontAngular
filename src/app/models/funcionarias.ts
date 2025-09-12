import { Servico } from './servicos';

export class Funcionaria {
  id?: number;
  nome?: string;
  sobrenome?: string;
  email?: string;
  telefone?: string;
  servicos_ids: number[] = [];
  servicos?: Servico[];
}
