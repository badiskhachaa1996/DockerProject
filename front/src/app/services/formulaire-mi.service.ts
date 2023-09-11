import { Injectable } from '@angular/core';
import { FormulaireMI } from '../models/FormulaireMI';
import { DestinationMI } from '../models/DestinationMI';
import { DateSejourMI } from '../models/DateSejourMI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormulaireMIService {

  apiUrl = environment.origin + "fIM/"
  constructor(private httpClient: HttpClient) { }

  create(data: FormulaireMI) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<FormulaireMI>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  delete(id: string) {
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.httpClient.delete<FormulaireMI>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<FormulaireMI[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  DScreate(data: DateSejourMI) {
    let registreUrl = this.apiUrl + "DS/create";
    return this.httpClient.post<DateSejourMI>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  DSupdate(data: DateSejourMI) {
    let registreUrl = this.apiUrl + "DS/update";
    return this.httpClient.put<DateSejourMI>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }


  DSgetAll() {
    let registreUrl = this.apiUrl + "DS/getAll";
    return this.httpClient.get<DateSejourMI[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  DEcreate(data: DestinationMI) {
    let registreUrl = this.apiUrl + "DE/create";
    return this.httpClient.post<DestinationMI>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }
  DEupdate(data: DestinationMI) {
    let registreUrl = this.apiUrl + "DE/update";
    return this.httpClient.put<DestinationMI>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }


  DEgetAll() {
    let registreUrl = this.apiUrl + "DE/getAll";
    return this.httpClient.get<DestinationMI[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }
}
