import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Demande_events } from '../models/Demande_events';
import { sourceForm } from '../models/sourceForm';

@Injectable({
  providedIn: 'root'
})
export class DemandeEventsService {

  apiUrl = environment.origin + "demande-events/"

  constructor(private httpClient: HttpClient) { }

    //methode d'ajout d'une demande d'inscription aux portes ouverts
    create(tbObj: sourceForm) {
      let registreUrl = this.apiUrl + "create";
      return this.httpClient.post<sourceForm>(registreUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
    }

    getAll(){
      let registreUrl = this.apiUrl + "getAll";
      return this.httpClient.get<sourceForm[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
    }

    clearDuplicate(){
      let registreUrl = this.apiUrl + "clearDuplicate";
      return this.httpClient.get<sourceForm[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
 
    }

}
