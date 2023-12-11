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
    return this.httpClient.post<LeadCRM>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
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
  getByEmail(email: string) {
    let registreUrl = this.apiUrl + "getByEmail/" + email;
    return this.httpClient.get<LeadCRM>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getOneByID(id: string) {
    let registreUrl = this.apiUrl + "getOneByID/" + id;
    return this.httpClient.get<LeadCRM>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
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

  insertDB(data: { toInsert: LeadCRM[], toUpdate: LeadCRM[] }) {
    let registreUrl = this.apiUrl + "insertDB"
    return this.httpClient.post<any>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllNonQualifies() {
    let registreUrl = this.apiUrl + "getAllNonQualifies";
    return this.httpClient.get<LeadCRM[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
// does not work must check
  getAllPreQualifies() {
    let registreUrl = this.apiUrl + "getAllPreQualifies";
    return this.httpClient.get<LeadCRM[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  // does not work !! must check
  getAllQualifies() {
    let registreUrl = this.apiUrl + "getAllQualifies";
    return this.httpClient.get<LeadCRM[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllNonQualifiesByID(id) {
    let registreUrl = this.apiUrl + "getAllNonQualifies/" + id;
    return this.httpClient.get<LeadCRM[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllPreQualifiesByID(id) {
    let registreUrl = this.apiUrl + "getAllPreQualifies/" + id;
    return this.httpClient.get<LeadCRM[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllQualifiesByID(id) {
    let registreUrl = this.apiUrl + "getAllQualifies/" + id;
    return this.httpClient.get<LeadCRM[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  moveFiles({ prospect_id, lead_id }) {
    let registreUrl = this.apiUrl + "moveFiles/" + prospect_id + "/" + lead_id;
    return this.httpClient.get<LeadCRM[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

}
