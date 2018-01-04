import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechacorta'
})
export class FechacortaPipe implements PipeTransform {

  transform(fecha: any): string {
    if (!fecha) { return ''; }
    if (fecha.date) { fecha = fecha.date; }
    // console.log(fecha);
    // console.log(Object.prototype.toString.call(fecha));
    if (fecha.date) { fecha = fecha.date; }
    const f: Date = new Date(fecha);
    return fecha.getDate() + '/' + fecha.getMonth() + '/' + fecha.getFullYear();
  }

}
