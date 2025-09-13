// src/app/pages/calendario/calendario.ts

import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { Agendamento, AgendamentoService } from '../../services/agendamento-service';
import { FormAgendamentoComponent } from '../../components/forms/forms-agendamentos/forms-agendamentos';
import { ServicosService } from '../../services/servicos-service';
import { ClienteService } from '../../services/cliente-service';
import { FuncionariasService } from '../../services/funcionarias-service';
@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormAgendamentoComponent], // Adicione o formulário aqui
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.css'],
})
export class Calendario implements OnInit {
  @ViewChild('meuCalendario') calendarComponent!: FullCalendarComponent;

  // --- LÓGICA DO MODAL ---
  isModalVisible = false;
  agendamentoSelecionado: Agendamento | null = null;

  // --- DADOS PARA OS DROPDOWNS DO FORMULÁRIO ---
  listaClientes: any[] = [];
  listaServicos: any[] = [];
  listaFuncionarias: any[] = [];

  initialView: 'timeGridWeek' | 'timeGridDay' = 'timeGridWeek';

  constructor(
    private agendamentoService: AgendamentoService,
    private servicosService: ServicosService,
    private clientesService: ClienteService,
    private funcionariaService: FuncionariasService
  ) {
    this.servicosService.listaServicos$.subscribe((servicos) => {
      this.listaServicos = servicos;
    });
    this.clientesService.listaClientes$.subscribe((clientes) => {
      this.listaClientes = clientes;
    });
    this.funcionariaService.listaFuncionarias$.subscribe((funcionarias) => {
      this.listaFuncionarias = funcionarias;
    });
  }

  ngOnInit() {
    // Lógica Mobile-First: Define a view padrão para 'dia' em telas pequenas
    if (window.innerWidth < 768) {
      this.initialView = 'timeGridDay';
    }
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: this.initialView,
    locale: ptBrLocale,
    weekends: true,
    editable: true, // Permite arrastar e soltar eventos
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
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
      list: 'Lista',
    },

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

    events: (fetchInfo, successCallback, failureCallback) => {
      this.agendamentoService.getAgendamentos().subscribe({
        next: (agendamentos) => {
          // Garante que o id seja string, conforme exigido por EventInput
          const eventos = agendamentos.map((agendamento: any) => ({
            ...agendamento,
            id: agendamento.id != null ? String(agendamento.id) : undefined,
          }));
          successCallback(eventos);
        },
        error: (err) => {
          console.error('Erro ao buscar agendamentos', err);
          failureCallback(err);
        },
      });
    },

    // INTERAÇÕES ATUALIZADAS PARA ABRIR O MODAL
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
  };

  // --- MÉTODOS DE CONTROLE DO MODAL E EVENTOS ---

  abrirModalParaNovo(dateInfo: DateClickArg) {
    const start = new Date(dateInfo.dateStr);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // Adiciona 1 hora por padrão

    this.agendamentoSelecionado = {
      start: dateInfo.dateStr,
      end: end.toISOString().substring(0, 16),
      extendedProps: {
        cliente_id: null,
        servico_id: null,
        funcionaria_id: null,
      },
    };
    this.isModalVisible = true;
  }

  abrirModalParaEditar(clickInfo: EventClickArg) {
    this.agendamentoSelecionado = {
      id: clickInfo.event.id,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      extendedProps: clickInfo.event.extendedProps,
    };
    this.isModalVisible = true;
  }

  fecharModal() {
    this.isModalVisible = false;
    this.agendamentoSelecionado = null;
  }

  salvarAgendamento(agendamento: any) {
    console.log('Salvando agendamento (simulação):', agendamento);
    // Em um app real, você chamaria o serviço para salvar no backend.
    // Aqui, apenas atualizamos a visualização para refletir a mudança.
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.refetchEvents(); // Pede ao FullCalendar para buscar os eventos novamente
    this.fecharModal();
  }

  // --- HANDLERS ATUALIZADOS QUE CHAMAM OS MÉTODOS DO MODAL ---

  handleEventClick(clickInfo: EventClickArg) {
    this.abrirModalParaEditar(clickInfo);
  }

  handleDateClick(dateInfo: DateClickArg) {
    this.abrirModalParaNovo(dateInfo);
  }
}
