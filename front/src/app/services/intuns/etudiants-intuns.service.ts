import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EtudiantIntuns } from 'src/app/models/intuns/EtudiantIntuns';
import { FormationsIntuns } from 'src/app/models/intuns/formationsIntuns';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EtudiantsIntunsService {

  apiUrl = environment.origin + "intuns/";

  constructor(private http: HttpClient) { }

  FIcreate(data: FormationsIntuns) {
    let registerUrl = this.apiUrl + 'FI/create';
    return this.http.post<FormationsIntuns>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  FIupdate(data: FormationsIntuns) {
    let registerUrl = this.apiUrl + 'FI/update';
    return this.http.put<FormationsIntuns>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  EIupdate(data: EtudiantIntuns) {
    let registerUrl = this.apiUrl + 'EI/update';
    return this.http.put<EtudiantIntuns>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  FIgetAll() {
    let registerUrl = this.apiUrl + 'FI/getAll';
    return this.http.get<FormationsIntuns[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  EIcreate(data: EtudiantIntuns) {
    let registerUrl = this.apiUrl + 'EI/create';
    return this.http.post<EtudiantIntuns>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  EIgetByID(id: string) {
    let registerUrl = this.apiUrl + 'EI/getByID/' + id;
    return this.http.get<EtudiantIntuns>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  EIgetByUSERID(id: string) {
    let registerUrl = this.apiUrl + 'EI/getByUSERID/' + id;
    return this.http.get<EtudiantIntuns>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  EIgetAll() {
    let registerUrl = this.apiUrl + 'EI/getAll';
    return this.http.get<EtudiantIntuns[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
}
