import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Ecole } from '../models/Ecole';

@Injectable({
  providedIn: 'root'
})
export class EcoleService {

  apiUrl = environment.origin + "ecole/"
  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };
  constructor(private http: HttpClient) { }

  getAll() {
    let ecoleUrl = this.apiUrl + "getAll";
    return this.http.get<Ecole[]>(ecoleUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllByAnnee(id: any) {
    let ecoleUrl = this.apiUrl + "getAllByAnnee/" + id;
    return this.http.get<any>(ecoleUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getByID(id: any) {
    let ecoleUrl = this.apiUrl + "getById/" + id;
    return this.http.get<any>(ecoleUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  create(ecole: any) {
    let ecoleUrl = this.apiUrl + "createecole";
    return this.http.post<any>(ecoleUrl, ecole, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  edit(ecole: any) {
    let ecoleUrl = this.apiUrl + "editById";
    return this.http.put<Ecole>(ecoleUrl, ecole, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  sendLogo(formData: FormData) {
    let ecoleUrl = this.apiUrl + "sendLogo";
    return this.http.post<any>(ecoleUrl, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  sendCachet(formData: FormData) {
    let ecoleUrl = this.apiUrl + "sendCachet";
    return this.http.post<any>(ecoleUrl, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  sendPp(formData: FormData) {
    let ecoleUrl = this.apiUrl + "sendPp";
    return this.http.post<any>(ecoleUrl, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  downloadCachet(ecole_id: string) {
    let ecoleUrl = this.apiUrl + "downloadCachet/" + ecole_id;
    return this.http.get<Blob>(ecoleUrl, { responseType: 'blob' as 'json', headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  downloadLogo(ecole_id: string) {
    let ecoleUrl = this.apiUrl + "downloadLogo/" + ecole_id;
    return this.http.get<Blob>(ecoleUrl, { responseType: 'blob' as 'json', headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  downloadPied(ecole_id: string) {
    let ecoleUrl = this.apiUrl + "downloadPied/" + ecole_id;
    return this.http.get<Blob>(ecoleUrl, { responseType: 'blob' as 'json', headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  saveColor(ecole_id, color) {
    color=color.replace('#',"")
    let ecoleUrl = this.apiUrl + "saveColor/" + ecole_id + "/" + color;
    return this.http.get<Ecole>(ecoleUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
