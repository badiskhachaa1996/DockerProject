import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Target } from '../models/Target';

@Injectable({
  providedIn: 'root'
})
export class TargetService {

  apiUrl = environment.origin + "target/"
  constructor(private httpClient: HttpClient) { }

  create(data: Target) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Target>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  update(data: Target) {
    let registreUrl = this.apiUrl + "update";
    return this.httpClient.put<Target>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  delete(id: string) {
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.httpClient.delete<Target>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Target[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
