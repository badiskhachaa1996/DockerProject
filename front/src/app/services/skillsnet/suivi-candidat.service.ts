import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExterneSkillsnet } from 'src/app/models/ExterneSkillsnet';
import { SuiviCandidat } from 'src/app/models/SuiviCandidat';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuiviCandidatService {

  apiUrl = environment.origin + "suivi-candidat/";
  constructor(private httpClient: HttpClient) { }
  create(tbObj: SuiviCandidat) {
    let url = this.apiUrl + 'create';
    return this.httpClient.post<SuiviCandidat>(url, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  update(obj: any) {
    let url = this.apiUrl + 'update';
    return this.httpClient.put<SuiviCandidat>(url, obj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  delete(id: string) {
    let url = this.apiUrl + 'delete/' + id;
    return this.httpClient.delete<SuiviCandidat>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAll() {
    let url = this.apiUrl + 'getAll';
    return this.httpClient.get<SuiviCandidat[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  getAllByEntrepriseID(id) {
    let url = this.apiUrl + 'getAllByEntrepriseID/' + id;
    return this.httpClient.get<SuiviCandidat[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }
}
