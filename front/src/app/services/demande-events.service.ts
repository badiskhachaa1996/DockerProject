import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Demande_events } from '../models/Demande_events';

@Injectable({
  providedIn: 'root'
})
export class DemandeEventsService {

  apiUrl = environment.origin + "demande-events/"

  constructor(private httpClient: HttpClient) { }

    //methode d'ajout d'une demande d'inscription aux portes ouverts
    create(tbObj: any) {
      let registreUrl = this.apiUrl + "create";
      console.log("service", tbObj);
      return this.httpClient.post<Demande_events>(registreUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
    }

    getAll(){
      let registreUrl = this.apiUrl + "getAll";
      console.log("service ok")
      return this.httpClient.get<Demande_events[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
    }


}
