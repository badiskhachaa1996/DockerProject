import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EmailType } from '../models/EmailType';

@Injectable({
  providedIn: 'root'
})
export class EmailTypeService {

  apiUrl = environment.origin + "emailType/"
  constructor(private httpClient: HttpClient) { }

  create(data: EmailType) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<EmailType>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  update(data: EmailType) {
    let registreUrl = this.apiUrl + "update";
    return this.httpClient.put<EmailType>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  delete(id: string) {
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.httpClient.delete<EmailType>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<EmailType[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  uploadSignature(formData: FormData) {
    let registreUrl = this.apiUrl + "uploadSignature";
    return this.httpClient.post<EmailType>(registreUrl, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllSignature() {
    let url = this.apiUrl + "getAllSignature"
    return this.httpClient.get<{ files: {}, ids: string[] }>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
