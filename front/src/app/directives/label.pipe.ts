import { Pipe, PipeTransform } from '@angular/core';
import { AnneeScolaireService } from '../services/annee-scolaire.service';
import { map } from 'rxjs';

@Pipe({
  name: 'label'
})
export class LabelPipe implements PipeTransform {

  transform(id: any, array: any): any {

    console.log(array)
    array.forEach(el => console.log(el)) 
    let index = array.findIndex((el) => el.id == id);
    return index
   }


  }
  

