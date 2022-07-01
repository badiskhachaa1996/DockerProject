import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { historiqueEchange } from '../models/historiqueEchange';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueEchangeService {

  apiUrl = environment.origin + "historiqueEchange/"

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  constructor(private httpClient: HttpClient) { }

  create(histo: historiqueEchange)
  {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<historiqueEchange>(registreUrl, histo, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getByID(id:string){
    let url = this.apiUrl + "getById/"+id;
    return this.httpClient.get<historiqueEchange>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAll(){
    let url = this.apiUrl + "getAll";
    return this.httpClient.get<historiqueEchange[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByAgentID(id:string){
    let url = this.apiUrl + "getAllByAgentID/"+id;
    return this.httpClient.get<historiqueEchange[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
