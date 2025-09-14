// src/app/pages/calendario/calendario.ts

import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { Agendamento } from '../../models/Agendamento';
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

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormAgendamentoComponent],
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.css'],
})
export class Calendario implements OnInit, OnDestroy {
  @ViewChild('meuCalendario') calendarComponent!: FullCalendarComponent;

  // --- LÓGICA DO MODAL ---
  isModalVisible = false;
  agendamentoSelecionado: any | null = null;

  // --- DADOS PARA OS DROPDOWNS DO FORMULÁRIO ---
  listaClientes: Cliente[] = [];
  listaServicos: Servico[] = [];
  listaFuncionarias: Funcionaria[] = [];

  // A propriedade de eventos agora é um array simples que será atualizado reativamente
  listaAgendamentos: EventInput[] = [];

  private destroy$ = new Subject<void>(); // Para gerenciar o cancelamento de inscrições
  initialView: 'timeGridWeek' | 'timeGridDay' = 'timeGridWeek';

  // Declara calendarOptions, que será inicializado no ngOnInit
  calendarOptions!: CalendarOptions;

  constructor(
    private agendamentoService: AgendamentoService,
    private servicosService: ServicosService,
    private clientesService: ClienteService,
    private funcionariaService: FuncionariasService
  ) {}

  ngOnInit() {
    // Lógica Mobile-First para a visão inicial
    if (window.innerWidth < 768) {
      this.initialView = 'timeGridDay';
    }

    // Inscreve-se no fluxo de agendamentos do serviço
    this.agendamentoService.listaAgendamentos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((agendamentos) => {
        // Converte o ID para string para o FullCalendar e atualiza a lista local
        this.listaAgendamentos = agendamentos.map((ag) => ({ ...ag, id: String(ag.id) }));
        // Se as opções do calendário já existirem, atualiza os eventos
        if (this.calendarOptions) {
          this.calendarOptions.events = this.listaAgendamentos;
        }
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
      hiddenDays: [0],
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
      // A propriedade 'events' agora aponta para o nosso array local reativo
      events: this.listaAgendamentos,
      eventClick: this.handleEventClick.bind(this),
      dateClick: this.handleDateClick.bind(this),
      select: this.handleSelect.bind(this),
    };
  }

  ngOnDestroy() {
    // Cancela todas as inscrições quando o componente é destruído para evitar vazamentos de memória
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- MÉTODOS DE CONTROLE DO MODAL ---
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
    this.isModalVisible = false;
    this.agendamentoSelecionado = null;
  }

  salvarAgendamento(agendamento: Agendamento) {
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
    this.abrirModalParaEditar(clickInfo);
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
}
