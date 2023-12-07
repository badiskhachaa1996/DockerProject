import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MemberCRM } from 'src/app/models/memberCRM';
import { TeamsCRM } from 'src/app/models/TeamsCRM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamsCrmService {

  apiUrl = environment.origin + "teamsCRM/";

  constructor(private http: HttpClient) { }

  TIcreate(data: TeamsCRM) {
    let registerUrl = this.apiUrl + 'TI/create';
    return this.http.post<TeamsCRM>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  TIupdate(data: TeamsCRM) {
    let registerUrl = this.apiUrl + 'TI/update';
    return this.http.put<TeamsCRM>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  TIgetByID(id: string) {
    let registerUrl = this.apiUrl + 'TI/getByID/' + id;
    return this.http.get<TeamsCRM>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  TIgetAll() {
    let registerUrl = this.apiUrl + 'TI/getAll';
    return this.http.get<TeamsCRM[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  MIcreate(data: MemberCRM) {
    let registerUrl = this.apiUrl + 'MI/create';
    return this.http.post<MemberCRM>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }



  MIupdate(data: MemberCRM) {
    let registerUrl = this.apiUrl + 'MI/update';
    return this.http.put<MemberCRM>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  MIgetByUSERID(id: string) {
    let registerUrl = this.apiUrl + 'MI/getByUSERID/' + id;
    return this.http.get<MemberCRM>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  MIgetByEQUIPEID(id: string) {
    let registerUrl = this.apiUrl + 'MI/getByTeamID/' + id;
    return this.http.get<MemberCRM[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  MIgetAll() {
    let registerUrl = this.apiUrl + 'MI/getAll';
    return this.http.get<MemberCRM[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }


  MIdelete(user_id: string) {
    let registerUrl = this.apiUrl + 'MI/delete/' + user_id;
    return this.http.delete<MemberCRM>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })

  }

  TIdelete(user_id: string) {
    let registerUrl = this.apiUrl + 'TI/delete/' + user_id;
    return this.http.delete<TeamsCRM>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
}
