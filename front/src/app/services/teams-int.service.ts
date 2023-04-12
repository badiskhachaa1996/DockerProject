import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MemberInt } from '../models/memberInt';
import { TeamsInt } from '../models/teamsInt';

@Injectable({
  providedIn: 'root'
})
export class TeamsIntService {

  apiUrl = environment.origin + "teamsInt/";

  constructor(private http: HttpClient) { }

  TIcreate(data: TeamsInt) {
    let registerUrl = this.apiUrl + 'TI/create';
    return this.http.post<TeamsInt>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  TIupdate(data: TeamsInt) {
    let registerUrl = this.apiUrl + 'TI/update';
    return this.http.put<TeamsInt>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  TIgetByID(id: string) {
    let registerUrl = this.apiUrl + 'TI/getByID/' + id;
    return this.http.get<TeamsInt>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  TIgetAll() {
    let registerUrl = this.apiUrl + 'TI/getAll';
    return this.http.get<TeamsInt[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  MIcreate(data: MemberInt) {
    let registerUrl = this.apiUrl + 'MI/create';
    return this.http.post<MemberInt>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }



  MIupdate(data: MemberInt) {
    let registerUrl = this.apiUrl + 'MI/update';
    return this.http.put<MemberInt>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  MIgetByUSERID(id: string) {
    let registerUrl = this.apiUrl + 'MI/getByUSERID/' + id;
    return this.http.get<MemberInt>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  MIgetAll() {
    let registerUrl = this.apiUrl + 'MI/getAll';
    return this.http.get<MemberInt[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
}
