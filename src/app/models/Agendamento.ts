export class Agendamento {
  id?: number | string;
  title?: string;
  start?: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  cliente_id?: string | null;
  funcionaria_id?: number | null;
  servico_id?: number | null;

  extendedProps?: {
    cliente_id?: number | null;
    funcionaria_id?: number | null;
    servico_id?: number | null;
  };
}
