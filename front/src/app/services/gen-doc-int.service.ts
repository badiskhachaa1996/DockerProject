import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DocumentInternational } from '../models/DocumentInternational';

@Injectable({
  providedIn: 'root'
})
export class GenDocIntService {
  apiUrl = environment.origin + "docGenInt/";

  constructor(private http: HttpClient) { }
  create(data: DocumentInternational) {
    let registreUrl = this.apiUrl + "create";
    return this.http.post<DocumentInternational>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  update(data: DocumentInternational) {
    let registreUrl = this.apiUrl + "update";
    return this.http.put<DocumentInternational>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  delete(id: string) {
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.http.delete<DocumentInternational>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  upload(formData: FormData, id) {
    let url = this.apiUrl + "upload/" + id
    return this.http.post<DocumentInternational>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) });

  }

  getAll() {
    let url = this.apiUrl + "getAll"
    return this.http.get<DocumentInternational[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })

  }

  download(id: string, filename: string) {
    let url = this.apiUrl + "download/" + id + "/" + filename;
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) })

  }
}
