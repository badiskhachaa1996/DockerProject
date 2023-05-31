import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LeadCRM } from 'src/app/models/LeadCRM';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadcrmService {
  apiUrl = environment.origin + "LeadCRM/"
  constructor(private httpClient: HttpClient) { }

  create(data: LeadCRM) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<LeadCRM>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  update(data: LeadCRM) {
    let registreUrl = this.apiUrl + "update";
    return this.httpClient.put<LeadCRM>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  delete(id: string) {
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.httpClient.delete<LeadCRM>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<LeadCRM[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllByID(id: string) {
    let registreUrl = this.apiUrl + "getAllByID/" + id;
    return this.httpClient.get<LeadCRM[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  getAllNonAffecte() {
    let registreUrl = this.apiUrl + "getAllNonAffecte";
    return this.httpClient.get<LeadCRM[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  uploadFile(formData: FormData) {
    let registreUrl = this.apiUrl + "uploadFile"
    return this.httpClient.post<LeadCRM>(registreUrl, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  downloadFile(_id: string, file_id: string, path: string) {
    let registreUrl = this.apiUrl + "downloadFile/" + _id + "/" + file_id + "/" + path
    return this.httpClient.get<{ file: string, documentType: string }>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

}
