import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Evenements } from 'src/app/models/Evenements';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvenementsService {
  apiUrl = environment.origin + "evenements/";
  constructor(private httpClient: HttpClient) { }
  create(tbObj: any) {
    let url = this.apiUrl + 'create';
    return this.httpClient.post<Evenements>(url, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  update(id: string, obj: any) {
    let url = this.apiUrl + 'update/' + id;
    return this.httpClient.put<Evenements>(url, obj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  getByID(id: string) {
    let url = this.apiUrl + 'getByID/' + id;
    return this.httpClient.get<Evenements>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAll() {
    let url = this.apiUrl + 'getAll';
    return this.httpClient.get<Evenements[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  updateInscrit(id: string, list_inscrit: string[]) {
    let url = this.apiUrl + "updateInscrit/" + id
    return this.httpClient.post<Evenements>(url, { list_inscrit }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }
}
