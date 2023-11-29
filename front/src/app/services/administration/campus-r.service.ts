import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CampusR } from 'src/app/models/CampusRework';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CampusRService {

  apiUrl = environment.origin + "campusR/"
  constructor(private http: HttpClient, private _router: Router) { }
  create(campus: any) {
    let campusUrl = this.apiUrl + "create";
    return this.http.post<any>(campusUrl, campus, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  update(c: any) {
    let campusUrl = this.apiUrl + "update/" + c._id;
    return this.http.put<CampusR>(campusUrl, c, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }
  get(Campus: any) {
    let campusUrl = this.apiUrl + "get/" + Campus;
    return this.http.get<any>(campusUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAll() {
    let campusUrl = this.apiUrl + "getAll";
    return this.http.get<CampusR[]>(campusUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  delete(campus_id) {
    let campusUrl = this.apiUrl + "delete/" + campus_id;
    return this.http.delete<CampusR>(campusUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  getAllByEcole(id: any) {
    let campusUrl = this.apiUrl + "getAllByEcole/" + id;
    return this.http.get<CampusR[]>(campusUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
