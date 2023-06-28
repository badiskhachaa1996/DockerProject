import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Mail } from '../models/Mail';
import { MailType } from '../models/MailType';
import { MailAuto } from '../models/MailAuto';
import { HistoriqueEmail } from '../models/HistoriqueEmail';

@Injectable({
  providedIn: 'root'
})
export class EmailTypeService {

  apiUrl = environment.origin + "mail/"
  constructor(private httpClient: HttpClient) { }

  create(data: Mail) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Mail>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  update(data: Mail) {
    let registreUrl = this.apiUrl + "update";
    return this.httpClient.put<Mail>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  delete(id: string) {
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.httpClient.delete<Mail>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Mail[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  uploadSignature(formData: FormData) {
    let registreUrl = this.apiUrl + "uploadSignature";
    return this.httpClient.post<Mail>(registreUrl, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllSignature() {
    let url = this.apiUrl + "getAllSignature"
    return this.httpClient.get<{ files: {}, ids: string[] }>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  MTcreate(data: MailType) {
    let registreUrl = this.apiUrl + "MT/create";
    return this.httpClient.post<MailType>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  MTupdate(data: MailType) {
    let registreUrl = this.apiUrl + "MT/update";
    return this.httpClient.put<MailType>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  MTdelete(id: string) {
    let registreUrl = this.apiUrl + "MT/delete/" + id;
    return this.httpClient.delete<MailType>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  MTgetAll() {
    let registreUrl = this.apiUrl + "MT/getAll";
    return this.httpClient.get<MailType[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  MAcreate(data: MailAuto) {
    let registreUrl = this.apiUrl + "MA/create";
    return this.httpClient.post<MailAuto>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  MAupdate(data: MailAuto) {
    let registreUrl = this.apiUrl + "MA/update";
    return this.httpClient.put<MailAuto>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  MAdelete(id: string) {
    let registreUrl = this.apiUrl + "MA/delete/" + id;
    return this.httpClient.delete<MailAuto>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  MAgetAll() {
    let registreUrl = this.apiUrl + "MA/getAll";
    return this.httpClient.get<MailAuto[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  HEcreate(data: HistoriqueEmail) {
    let registreUrl = this.apiUrl + "HE/create";
    return this.httpClient.post<HistoriqueEmail>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  HEupdate(data: HistoriqueEmail) {
    let registreUrl = this.apiUrl + "HE/update";
    return this.httpClient.put<HistoriqueEmail>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  HEdelete(id: string) {
    let registreUrl = this.apiUrl + "HE/delete/" + id;
    return this.httpClient.delete<HistoriqueEmail>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  HEgetAll() {
    let registreUrl = this.apiUrl + "HE/getAll";
    return this.httpClient.get<HistoriqueEmail[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  HEgetAllTo(id) {
    let registreUrl = this.apiUrl + "HE/getAllTo/" + id;
    return this.httpClient.get<HistoriqueEmail[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  sendPerso(data: HistoriqueEmail) {
    let registreUrl = this.apiUrl + "sendPerso";
    return this.httpClient.post<HistoriqueEmail>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  testEmail(data: { email: string, password: string, to: string }) {
    let registreUrl = this.apiUrl + "testEmail";
    return this.httpClient.post<{ r: string }>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
