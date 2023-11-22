import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DisponibiliteEtudiant } from '../models/DisponibiliteEtudiant';

@Injectable({
  providedIn: 'root'
})
export class CalendrierEtudiantService {

  apiUrl = environment.origin + "disponbiliteEtudiant/"
  constructor(private httpClient: HttpClient) { }

  create(data: any) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<DisponibiliteEtudiant>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  update(data: any) {
    let registreUrl = this.apiUrl + "update";
    return this.httpClient.put<DisponibiliteEtudiant>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  delete(id: string) {
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.httpClient.delete<DisponibiliteEtudiant>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<DisponibiliteEtudiant[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }


  getAllByUSERID(user_id) {
    let registreUrl = this.apiUrl + "getAllByUSERID/" + user_id;
    return this.httpClient.get<DisponibiliteEtudiant[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }
}
