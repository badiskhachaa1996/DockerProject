import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { historiqueEchange } from '../models/historiqueEchange';
const httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };
@Injectable({
  providedIn: 'root'
})
export class HistoriqueEchangeService {

  apiUrl = environment.origin + "historiqueEchange/"

  constructor(private httpClient: HttpClient) { }

  create(histo: historiqueEchange)
  {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<historiqueEchange>(registreUrl, histo, httpOptions1);
  }

  getByID(id:string){
    let url = this.apiUrl + "getById/"+id;
    return this.httpClient.get<historiqueEchange>(url, httpOptions1);
  }

  getAll(){
    let url = this.apiUrl + "getAll";
    return this.httpClient.get<historiqueEchange[]>(url, httpOptions1);
  }

  getAllByAgentID(id:string){
    let url = this.apiUrl + "getAllByAgentID/"+id;
    return this.httpClient.get<historiqueEchange[]>(url, httpOptions1);
  }
}
