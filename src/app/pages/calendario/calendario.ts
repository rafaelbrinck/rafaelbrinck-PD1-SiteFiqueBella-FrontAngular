// Cole este código no seu arquivo: src/app/pages/calendario/calendario.ts

import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list'; // Importar o plugin de lista
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { AgendamentoService } from '../../services/agendamento-service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.css'],
})
export class Calendario implements OnInit {
  @ViewChild('meuCalendario') calendarComponent!: FullCalendarComponent;

  // Propriedade para definir a view inicial com base na tela
  initialView: 'timeGridWeek' | 'timeGridDay' = 'timeGridWeek';

  constructor(private agendamentoService: AgendamentoService) {}

  ngOnInit() {
    // Lógica Mobile-First: Define a view padrão para 'dia' em telas pequenas
    if (window.innerWidth < 768) {
      // 768px é o breakpoint 'md' do Tailwind
      this.initialView = 'timeGridDay';
    }
  }

  calendarOptions: CalendarOptions = {
    // --- PLUGINS E CONFIGURAÇÕES GERAIS ---
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
    allDaySlot: false, // Desativa o slot "Dia todo"

    // --- NOVAS OPÇÕES DE INTERVALO DE TEMPO ---
    slotDuration: '00:30:00', // Define que cada "slot" tem 30 minutos
    slotLabelInterval: '00:30:00', // Mostra os rótulos de hora (08:00, 08:30...) a cada 30 minutos

    // --- HORÁRIOS DE FUNCIONAMENTO ---
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    hiddenDays: [0], // Esconde Domingo

    // --- BARRA DE FERRAMENTAS (HEADER) ---
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

    // --- CUSTOMIZAÇÃO AVANÇADA DE DATAS E TÍTULOS ---
    viewDidMount: (info) => {
      // Deixa o título padrão para Mês e Dia
      if (info.view.type === 'dayGridMonth' || info.view.type === 'timeGridDay') {
        return;
      }
      // Customiza o título apenas para a visão de Semana
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

    // --- EVENTOS ---
    events: (fetchInfo, successCallback, failureCallback) => {
      this.agendamentoService.getAgendamentos().subscribe({
        next: (agendamentos) => {
          // Mapeia os agendamentos para garantir que o id seja string
          const eventos = agendamentos.map((agendamento) => ({
            ...agendamento,
            id: agendamento.id !== undefined ? String(agendamento.id) : undefined,
          }));
          successCallback(eventos);
        },
        error: (err) => {
          console.error('Erro ao buscar agendamentos', err);
          failureCallback(err);
        },
      });
    },

    // --- INTERAÇÕES (CLICKS) ---
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
  };

  handleEventClick(clickInfo: EventClickArg) {
    alert(`Agendamento selecionado: '${clickInfo.event.title}'`);
  }

  handleDateClick(arg: { dateStr: string }) {
    const calendarApi = this.calendarComponent.getApi();
    // Se não estivermos na visão de dia, muda para a visão de dia da data clicada
    if (calendarApi.view.type !== 'timeGridDay') {
      calendarApi.changeView('timeGridDay', arg.dateStr);
    }
  }
}
