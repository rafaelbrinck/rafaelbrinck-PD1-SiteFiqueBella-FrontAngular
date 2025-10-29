import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horaFormatada',
})
export class HoraFormatadaPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value) || value <= 0) {
      return '';
    }

    const totalMinutes = Math.round(value);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let result = '';

    if (hours > 0) {
      result += `${hours}h`;
    }

    if (minutes > 0) {
      if (hours > 0) {
        result += ' ';
      }
      result += `${minutes}min`;
    }

    return result || '';
  }
}
