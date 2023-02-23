import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExterneSkillsnet } from 'src/app/models/ExterneSkillsnet';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExterneSNService {

  apiUrl = environment.origin + "extSkillsnet/";
  constructor(private httpClient: HttpClient) { }
  create(tbObj: any, id: string) {
    let url = this.apiUrl + 'create/' + id;
    return this.httpClient.post<ExterneSkillsnet>(url, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  update(id: string, obj: any) {
    let url = this.apiUrl + 'update/' + id;
    return this.httpClient.put<ExterneSkillsnet>(url, obj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getByID(id: string) {
    let url = this.apiUrl + 'getByID/' + id;
    return this.httpClient.get<ExterneSkillsnet>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAll() {
    let url = this.apiUrl + 'getAll';
    return this.httpClient.get<ExterneSkillsnet[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
