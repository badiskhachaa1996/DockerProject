import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MeetingTeams } from '../models/MeetingTeams';
import jwt_decode from "jwt-decode";
@Injectable({
  providedIn: 'root'
})
export class MeetingTeamsService {

  apiUrl = environment.origin + "meetingTeams/"
  constructor(private httpClient: HttpClient) { }

  create(data: MeetingTeams) {
    let created_by
    if (localStorage.getItem('token')) {
      created_by = jwt_decode(localStorage.getItem('token'))
      created_by = created_by.id
    }
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<MeetingTeams>(registreUrl, { ...data, created_by }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  update(data: MeetingTeams) {
    let registreUrl = this.apiUrl + "update";
    return this.httpClient.put<MeetingTeams>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  delete(id: string) {
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.httpClient.delete<MeetingTeams>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<MeetingTeams[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByEmail(email) {
    let registreUrl = this.apiUrl + "getAllByEmail/" + email;
    return this.httpClient.get<MeetingTeams[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByUserID(user_id) {
    let registreUrl = this.apiUrl + "getAllByUserID/" + user_id;
    return this.httpClient.get<MeetingTeams[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllByOffreID(offer_id) {
    let registreUrl = this.apiUrl + "getAllByOffreID/" + offer_id;
    return this.httpClient.get<MeetingTeams[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
