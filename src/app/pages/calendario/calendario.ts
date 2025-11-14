// src/app/pages/calendario/calendario.ts

import { Component, ViewChild, OnInit, OnDestroy, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { DateClickArg, EventResizeDoneArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { Agendamento, AgendamentoDB, StatusEnum } from '../../models/Agendamento';
import { Cliente } from '../../models/cliente';
import { Servico } from '../../models/servicos';
import { Funcionaria } from '../../models/funcionarias';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormAgendamentoComponent } from '../../components/forms/forms-agendamentos/forms-agendamentos';
import { AgendamentoService } from '../../services/agendamento-service';
import { ClienteService } from '../../services/cliente-service';
import { FuncionariasService } from '../../services/funcionarias-service';
import { ServicosService } from '../../services/servicos-service';
import { DetalheAgendamento } from '../../components/datalhes/detalhe-agendamento/detalhe-agendamento';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormAgendamentoComponent, DetalheAgendamento],
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.css'],
})
export class Calendario implements OnInit, OnDestroy {
  @ViewChild('meuCalendario') calendarComponent!: FullCalendarComponent;
  @Input() ativaCad: boolean = false;

  // --- LÓGICA DO MODAL ---
  isModalVisible = false;
  isModalDetalhesVisible = false;
  agendamentoSelecionado: any | null = null;

  // --- DADOS PARA OS DROPDOWNS DO FORMULÁRIO ---
  listaClientes: Cliente[] = [];
  listaServicos: Servico[] = [];
  listaFuncionarias: Funcionaria[] = [];
  listaAgendamentos: Agendamento[] = [];

  // DADOS PARA O MODAL DE DETALHES
  clienteSelecionado: Cliente | null = null;
  servicoSelecionado: Servico | null = null;
  funcionariaSelecionada: Funcionaria | null = null;

  private destroy$ = new Subject<void>();
  initialView: 'timeGridWeek' | 'timeGridDay' = 'timeGridWeek';

  calendarOptions!: CalendarOptions;

  constructor(
    private agendamentoService: AgendamentoService,
    private servicosService: ServicosService,
    private clientesService: ClienteService,
    private funcionariaService: FuncionariasService
  ) {}

  ngOnInit() {
    this.agendamentoService.listaAgendamentos$.subscribe((agendamentos) => {
      if (agendamentos.length <= 0) {
        this.agendamentoService.getAgendamentos().subscribe();
      }
      this.listaAgendamentos = agendamentos;
      // Atualiza os eventos do calendário
      this.calendarOptions.events = this.listaAgendamentos;
    });
    // Lógica Mobile-First para a visão inicial
    if (window.innerWidth < 768) {
      this.initialView = 'timeGridDay';
    }

    this.agendamentoService.showModal$.subscribe((show) => {
      this.isModalVisible = show;
    });
    // Inscreve-se nos outros serviços para preencher os dropdowns do formulário
    this.servicosService.listaServicos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((servicos) => (this.listaServicos = servicos));
    this.clientesService.listaClientes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((clientes) => (this.listaClientes = clientes));
    this.funcionariaService.listaFuncionarias$
      .pipe(takeUntil(this.destroy$))
      .subscribe((funcionarias) => (this.listaFuncionarias = funcionarias));

    // Inicializa as opções do calendário
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: this.initialView,
      locale: ptBrLocale,
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      allDayText: 'Dia todo',
      noEventsText: 'Nenhum agendamento para mostrar',
      allDaySlot: false,
      slotDuration: '00:30:00',
      slotLabelInterval: '00:30:00',
      slotMinTime: '08:00:00',
      slotMaxTime: '20:00:00',

      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      buttonText: { today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia', list: 'Lista' },
      viewDidMount: (info) => {
        if (info.view.type === 'timeGridWeek') {
          const startDate = info.view.activeStart;
          const endDate = info.view.activeEnd;
          const realEndDate = new Date(endDate);
          realEndDate.setDate(endDate.getDate() - 1);
          const startDay = startDate.getDate();
          const endDay = realEndDate.getDate();
          const month = new Intl.DateTimeFormat('pt-BR', { month: 'short' })
            .format(startDate)
            .replace('.', '');
          const customTitle = `${startDay} – ${endDay} ${month}`;
          const titleEl = info.el.querySelector('.fc-toolbar-title');
          if (titleEl) {
            titleEl.innerHTML = customTitle;
          }
        }
      },
      dayHeaderContent: (arg) => {
        const date = arg.date;
        const dayOfMonth = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const formattedDate = `${dayOfMonth}/${month}`;
        const dayOfWeek = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
          .format(date)
          .replace('.', '');
        return {
          html: `<div class="fc-dayheader-container"><span class="fc-dayheader-date">${formattedDate}</span><span class="fc-dayheader-day">${dayOfWeek}</span></div>`,
        };
      },
      events: this.listaAgendamentos,
      // eventResize: this.handleEventResize.bind(this),
      eventClick: this.handleEventClick.bind(this),
      dateClick: this.handleDateClick.bind(this),
      select: this.handleSelect.bind(this),
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- MÉTODOS DE CONTROLE DO MODAL ---
  abrirModalExterno() {
    this.agendamentoService.toogleModal();
  }
  abrirModalParaNovoPadrao() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0);
    this.abrirModalParaNovo(
      start.toISOString().substring(0, 16),
      end.toISOString().substring(0, 16)
    );
  }

  abrirModalParaNovo(start: string, end: string) {
    this.agendamentoSelecionado = {
      start: start,
      end: end,
      extendedProps: { cliente_id: null, servico_id: null, funcionaria_id: null },
    };
    this.isModalVisible = true;
  }

  abrirModalParaEditar(clickInfo: EventClickArg) {
    this.agendamentoSelecionado = {
      id: clickInfo.event.id,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      title: clickInfo.event.title,
      backgroundColor: clickInfo.event.backgroundColor,
      borderColor: clickInfo.event.borderColor,
      extendedProps: clickInfo.event.extendedProps,
    };
    this.isModalVisible = true;
  }

  fecharModal() {
    this.agendamentoService.toogleModal();
    this.agendamentoSelecionado = null;
  }

  salvarAgendamento(agendamento: AgendamentoDB) {
    if (agendamento.agendamento_id) {
      this.agendamentoService.atualizarAgendamento(agendamento);
      this.fecharModal();
      return;
    }
    this.agendamentoService.adicionarAgendamento(agendamento);
    this.fecharModal();
  }

  deletarAgendamento(agendamento: Agendamento) {
    const agendamentoId = agendamento.id;
    if (agendamentoId === null) {
      console.error('ID do agendamento é nulo. Não é possível deletar.');
      return;
    }
    this.agendamentoService.deleteAgendamento(agendamentoId!);
    this.fecharModal();
  }

  // --- HANDLERS DE INTERAÇÃO COM O CALENDÁRIO ---
  handleEventClick(clickInfo: EventClickArg) {
    // Pega os IDs do evento
    const props = clickInfo.event.extendedProps;

    // Encontra os objetos completos nas suas listas
    this.clienteSelecionado =
      this.listaClientes.find((c) => c.cliente_id === props['cliente_id']) || null;
    this.servicoSelecionado =
      this.listaServicos.find((s) => s.servico_id === props['servico_id']) || null;
    this.funcionariaSelecionada =
      this.listaFuncionarias.find((f) => f.funcionario_id === props['funcionaria_id']) || null;

    // Define o agendamento
    this.agendamentoSelecionado = {
      id: clickInfo.event.id,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      title: clickInfo.event.title,
      extendedProps: props,
    };

    // Abre o modal de DETALHES
    this.isModalDetalhesVisible = true;
  }

  handleDateClick(dateInfo: DateClickArg) {
    const calendarApi = this.calendarComponent.getApi();
    if (calendarApi.view.type === 'dayGridMonth') {
      calendarApi.changeView('timeGridDay', dateInfo.dateStr);
    } else {
      const start = new Date(dateInfo.dateStr);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      this.abrirModalParaNovo(
        start.toISOString().substring(0, 16),
        end.toISOString().substring(0, 16)
      );
    }
  }

  handleSelect(selectInfo: DateSelectArg) {
    if (selectInfo.view.type === 'timeGridWeek' || selectInfo.view.type === 'timeGridDay') {
      this.abrirModalParaNovo(selectInfo.startStr, selectInfo.endStr);
    }
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.unselect();
  }

  fecharTodosModais() {
    this.isModalDetalhesVisible = false;
    this.isModalVisible = false;
    this.agendamentoSelecionado = null;
  }
  // --- Métodos chamados pelos @Outputs do modal de detalhes ---

  // Quando o usuário clica em "Excluir" no modal de detalhes
  onTriggerDelete() {
    this.deletarAgendamento(this.agendamentoSelecionado);
    this.fecharTodosModais();
  }

  onTriggerEdit() {
    this.isModalDetalhesVisible = false;
    this.isModalVisible = true;
  }

  onTriggerComplete() {
    const agendamentoFinalizado = {
      agendamento_id: this.agendamentoSelecionado.id,
      cliente_id: this.agendamentoSelecionado.extendedProps['cliente_id'],
      funcionaria_id: this.agendamentoSelecionado.extendedProps['funcionaria_id'],
      servico_id: this.agendamentoSelecionado.extendedProps['servico_id'],
      data_hora_inicio: new Date(this.agendamentoSelecionado.start),
      data_hora_fim: new Date(this.agendamentoSelecionado.end),
      status: StatusEnum.CONCLUIDO,
    };

    this.agendamentoService.atualizarAgendamento(agendamentoFinalizado);
    this.fecharTodosModais();
  }

  // handleEventResize(resizeInfo: EventResizeDoneArg) {
  //   console.log('Evento redimensionado:', resizeInfo.event.id);

  //   // 1. Constrói o objeto AgendamentoDB com os novos horários
  //   //    (Certifique-se que o tipo do seu agendamento_id bate com o do evento)
  //   const agendamentoAtualizado: AgendamentoDB = {
  //     agendamento_id: resizeInfo.event.id as any, // Converte a string do ID se necessário
  //     data_hora_inicio: new Date(resizeInfo.event.startStr), // A nova data/hora de início
  //     data_hora_fim: new Date(resizeInfo.event.endStr), // A nova data/hora de fim

  //     // Mantém os dados relacionados
  //     cliente_id: resizeInfo.event.extendedProps['cliente_id'],
  //     servico_id: resizeInfo.event.extendedProps['servico_id'],
  //     funcionaria_id: resizeInfo.event.extendedProps['funcionaria_id'],
  //   };

  //   // 2. Chama o serviço para atualizar no banco
  //   const result = this.agendamentoService.atualizarAgendamento(agendamentoAtualizado);

  //   if (result) {
  //     console.log('Agendamento atualizado com sucesso:', agendamentoAtualizado);
  //   } else {
  //     console.error('Falha ao atualizar o agendamento:', agendamentoAtualizado);
  //     resizeInfo.revert();
  //   }
  // }
}
