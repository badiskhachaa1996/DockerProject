import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CandidatureLead } from '../models/CandidatureLead';

@Injectable({
  providedIn: 'root'
})
export class CandidatureLeadService {
  apiUrl = environment.origin + "candidatureLead/"
  constructor(private httpClient: HttpClient) { }

  create(data: CandidatureLead) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<CandidatureLead>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  update(data: CandidatureLead) {
    let registreUrl = this.apiUrl + "update";
    return this.httpClient.put<CandidatureLead>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getByLead(id: string) {
    let registreUrl = this.apiUrl + "getByLead/" + id;
    return this.httpClient.get<CandidatureLead>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  delete(id: string) {
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.httpClient.delete<CandidatureLead>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }


  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<CandidatureLead[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
