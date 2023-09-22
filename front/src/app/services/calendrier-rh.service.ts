import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EventCalendarRH } from '../models/EventCalendarRH';

@Injectable({
  providedIn: 'root'
})
export class CalendrierRhService {
  apiUrl = environment.origin + "calendrierRH/"
  constructor(private httpClient: HttpClient) { }

  create(data: EventCalendarRH) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<EventCalendarRH>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  update(data: EventCalendarRH) {
    let registreUrl = this.apiUrl + "update";
    return this.httpClient.put<EventCalendarRH>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  delete(id: string) {
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.httpClient.delete<EventCalendarRH>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<EventCalendarRH[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
