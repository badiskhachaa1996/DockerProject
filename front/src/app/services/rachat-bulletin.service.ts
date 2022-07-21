import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { RachatBulletin } from '../models/RachatBulletin';

@Injectable({
  providedIn: 'root'
})
export class RachatBulletinService {

  apiUrl = environment.origin + "rachatBulletin/"

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  constructor(private httpClient: HttpClient) { }

  //Creation d'une nouveau rb
  create(rb: RachatBulletin) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<RachatBulletin>(registreUrl, rb, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  update(rb: RachatBulletin) {
    let registreUrl = this.apiUrl + "update";
    return this.httpClient.post<RachatBulletin>(registreUrl, rb, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  get(id: string) {
    let registreUrl = this.apiUrl + "getByID/" + id;
    return this.httpClient.get<RachatBulletin>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getByUserID(user_id: string, semestre: string) {
    let registreUrl = this.apiUrl + "getByUserID/" + user_id + "/" + semestre;
    return this.httpClient.get<RachatBulletin[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  delete(_id:string){
    let registreUrl = this.apiUrl + "delete/" + _id;
    return this.httpClient.delete<RachatBulletin>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
