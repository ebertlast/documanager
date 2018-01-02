import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrar'
})
export class FiltrarPipe implements PipeTransform {

  transform(items: any[], field: string, value: string): any[] {
    // console.log('Filtrar Pipe: ');
    // console.log(items);
    // console.log(field);
    // console.log(value);
    if (!items) { return []; }
    // console.log(items.filter(it => it[field] == value));
    return items.filter(it => it[field] === value);
  }

}
