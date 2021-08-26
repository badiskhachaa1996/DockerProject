import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SujetService {
  private Sujets = [];
  constructor() { }

  createSujets(sujet){
      const newService = { id: Date.now(), ...sujet};
      this.Sujets = [sujet, ...this.Sujets] ;
      console.log(this.Sujets);
       }
  
       getSujets(){
         return this.Sujets;
       }
}
