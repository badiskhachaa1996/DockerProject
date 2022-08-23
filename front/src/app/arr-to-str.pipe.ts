import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrToStr'
})
export class ArrToStrPipe implements PipeTransform {

  transform(input: Array<string>, sep = ","): string {

    return input.toString();
  }

}
