import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { teamCommercial } from '../models/teamCommercial';

@Injectable({
  providedIn: 'root'
})
export class TeamCommercialService {

  apiUrl = environment.origin + "ticket/"

  constructor(private http: HttpClient) { }
  create(team: teamCommercial) {
    let registreUrl = this.apiUrl + "create";
    return this.http.post<teamCommercial>(registreUrl, team, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.http.get<teamCommercial[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getMyTeam() {
    let registreUrl = this.apiUrl + "getMyTeam";
    return this.http.get<teamCommercial>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  updateTeam(newTeam: teamCommercial) {
    let registreUrl = this.apiUrl + "updateTeam";
    return this.http.post<teamCommercial>(registreUrl, newTeam, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
