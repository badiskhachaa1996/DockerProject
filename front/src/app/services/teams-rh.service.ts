import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TeamsRH } from '../models/TeamsRH';
import { MemberRH } from '../models/memberRH';

@Injectable({
  providedIn: 'root'
})
export class TeamsRHService {


  apiUrl = environment.origin + "teamsRH/";

  constructor(private http: HttpClient) { }

  TRcreate(data: TeamsRH) {
    let registerUrl = this.apiUrl + 'TR/create';
    return this.http.post<TeamsRH>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  TRupdate(data: TeamsRH) {
    let registerUrl = this.apiUrl + 'TR/update';
    return this.http.put<TeamsRH>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  TRgetByID(id: string) {
    let registerUrl = this.apiUrl + 'TR/getByID/' + id;
    return this.http.get<TeamsRH>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  TRgetAll() {
    let registerUrl = this.apiUrl + 'TR/getAll';
    return this.http.get<TeamsRH[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  MRcreate(data: MemberRH) {
    let registerUrl = this.apiUrl + 'MR/create';
    return this.http.post<MemberRH>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }



  MRupdate(data: MemberRH) {
    let registerUrl = this.apiUrl + 'MR/update';
    return this.http.put<MemberRH>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  MRgetByUSERID(id: string) {
    let registerUrl = this.apiUrl + 'MR/getByUSERID/' + id;
    return this.http.get<MemberRH[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  MRgetAll() {
    let registerUrl = this.apiUrl + 'MR/getAll';
    return this.http.get<MemberRH[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  MRgetAllByTeamID(team_id) {
    let registerUrl = this.apiUrl + 'MR/getAllByTeamID/'+team_id;
    return this.http.get<MemberRH[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }


  MRdelete(user_id: string) {
    let registerUrl = this.apiUrl + 'MR/delete/' + user_id;
    return this.http.delete<MemberRH>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })

  }

  TRdelete(user_id: string) {
    let registerUrl = this.apiUrl + 'TI/delete/' + user_id;
    return this.http.delete<TeamsRH>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
}
