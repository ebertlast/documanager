import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizar'
})
export class CapitalizarPipe implements PipeTransform {

  transform(value: any): any {
    if (value) {
      value = value.toLowerCase().replace(/(^|\s)[a-z]/g, function (a) { return a.toUpperCase(); });
    }
    return value;
  }

}
