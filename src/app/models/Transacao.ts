export class Transacao {
  transacao_id!: string;
  cliente_id!: string;
  agendamento_id!: string;
  metodo_pagamento_id!: string;
  valor_pago!: number;
  data_pagamento!: Date;
  created_at!: Date;
  updated_at!: Date;
}
