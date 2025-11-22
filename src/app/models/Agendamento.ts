export class Agendamento {
  id?: string;
  title?: string;
  start?: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  cliente_id?: string | null;
  funcionaria_id?: string | null;
  servico_id?: string | null;
  status?: StatusEnum;
  extendedProps?: {
    cliente_id?: string | null;
    funcionaria_id?: string | null;
    servico_id?: string | null;
  };
}

export class AgendamentoDB {
  agendamento_id?: string;
  cliente_id?: string;
  funcionaria_id?: string;
  servico_id?: string;
  data_hora_inicio?: Date;
  data_hora_fim?: Date;
  status?: StatusEnum;
  created_at?: Date;
  updated_at?: Date;
}

export enum StatusEnum {
  AGENDADO = 'Agendado',
  CONCLUIDO = 'Concluído',
  CANCELADO = 'Cancelado',
}
