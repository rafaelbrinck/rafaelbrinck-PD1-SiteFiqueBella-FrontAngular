import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Cliente } from '../models/cliente';
import { Servico } from '../models/servicos';
import { ClienteService } from './cliente-service';
import { ServicosService } from './servicos-service';
import { Agendamento, AgendamentoDB } from '../models/Agendamento';
import { Enviroment } from '../enviroments/enviroment';
import { Funcionaria } from '../models/funcionarias';
import { FuncionariasService } from './funcionarias-service';
import { AuthService } from './auth-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  apiUrl = `${Enviroment.apiUrl}/agendamentos`;

  listaClientes: Cliente[] = [];
  listaServicos: Servico[] = [];
  listaFuncionarias: Funcionaria[] = [];

  private listaAgendamentosDB = new BehaviorSubject<AgendamentoDB[]>([]);
  listaAgendamentosDB$ = this.listaAgendamentosDB.asObservable();

  private listaAgendamentosSubject = new BehaviorSubject<Agendamento[]>([]);
  listaAgendamentos$ = this.listaAgendamentosSubject.asObservable();

  private showModalSubject = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModalSubject.asObservable();

  constructor(
    private clienteService: ClienteService,
    private servicoService: ServicosService,
    private funcionariaService: FuncionariasService,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.clienteService.listaClientes$.subscribe((clientes) => {
      this.listaClientes = clientes;
    });
    this.servicoService.listaServicos$.subscribe((servicos) => {
      this.listaServicos = servicos;
    });
    this.funcionariaService.listaFuncionarias$.subscribe((funcionarias) => {
      this.listaFuncionarias = funcionarias;
    });

    this.getAgendamentos().subscribe();
  }

  toogleModal() {
    this.showModalSubject.next(!this.showModalSubject.getValue());
  }

  getAgendamentos(): Observable<AgendamentoDB[]> {
    const headers = this.authService.getHeader();
    if (!headers) {
      return of([]);
    }
    return this.http.get<AgendamentoDB[]>(`${this.apiUrl}/list`, { headers: headers }).pipe(
      tap((agendamentosRecebidos: AgendamentoDB[]) => {
        this.listaAgendamentosDB.next(agendamentosRecebidos);
        const agendamentosConvertidos = agendamentosRecebidos.map((agendamento) => {
          const cliente = this.listaClientes.find((c) => c.cliente_id === agendamento.cliente_id);
          const funcionaria = this.listaFuncionarias.find(
            (f) => f.funcionario_id === agendamento.funcionaria_id
          );
          var corFundo = funcionaria?.nome === 'Claudia' ? '#D756AA' : '#489C3E';
          const servico = this.listaServicos.find((s) => s.servico_id === agendamento.servico_id);
          return {
            id: agendamento.agendamento_id,
            title: `${cliente ? cliente.nome : 'Cliente Desconhecido'} - ${
              servico ? servico.nome : 'Serviço Desconhecido'
            } - ${funcionaria ? funcionaria.nome : 'Funcionária Desconhecida'}`,
            start: agendamento.data_hora_inicio?.toString(),
            end: agendamento.data_hora_fim?.toString(),
            backgroundColor: corFundo,
            borderColor: '#3788d8',
            textColor: '#ffffff',
            extendedProps: {
              cliente_id: agendamento.cliente_id ? agendamento.cliente_id : null,
              funcionaria_id: agendamento.funcionaria_id ? agendamento.funcionaria_id : null,
              servico_id: agendamento.servico_id ? agendamento.servico_id : null,
            },
          } as Agendamento;
        });
        this.listaAgendamentosSubject.next(agendamentosConvertidos);
      })
    );
  }

  adicionarAgendamento(novoAgendamento: AgendamentoDB): boolean {
    const headers = this.authService.getHeader();
    if (!headers) {
      return false;
    }
    this.http
      .post<AgendamentoDB>(`${this.apiUrl}/insert`, novoAgendamento, { headers: headers })
      .subscribe({
        next: (agendamentoCadastrado) => {
          this.getAgendamentos().subscribe();
        },
        error: (error) => {
          console.error('Erro ao cadastrar agendamento:', error);
        },
      });
    return true;
  }

  atualizarAgendamento(agendamento: AgendamentoDB): boolean {
    const headers = this.authService.getHeader();
    if (!headers) {
      return false;
    }
    this.http
      .put<AgendamentoDB>(`${this.apiUrl}/update/${agendamento.agendamento_id}`, agendamento, {
        headers: headers,
      })
      .subscribe({
        next: (agendamentoAtualizado) => {
          this.getAgendamentos().subscribe();
        },
        error: (error) => {
          console.error('Erro ao atualizar agendamento:', error);
        },
      });
    return true;
  }

  deleteAgendamento(agendamentoId: number | string) {
    const headers = this.authService.getHeader();
    if (!headers) {
      return;
    }
    this.http.delete(`${this.apiUrl}/remove/${agendamentoId}`, { headers: headers }).subscribe({
      next: () => {
        this.getAgendamentos().subscribe();
      },
      error: (error) => {
        console.error('Erro ao deletar agendamento:', error);
      },
    });
    return true;
  }
}
