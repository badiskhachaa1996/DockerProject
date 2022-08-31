import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Campus } from '../models/Campus';

@Injectable({
  providedIn: 'root'
})
export class CampusService {
  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };
  apiUrl = environment.origin + "campus/"
  constructor(private http: HttpClient, private _router: Router) { }


  getAll() {
    let campusUrl = this.apiUrl + "getAll";
    return this.http.get<Campus[]>(campusUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllPopulate() {
    let campusUrl = this.apiUrl + "getAllPopulate";
    return this.http.get<Campus[]>(campusUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getByID(Campus: any) {
    let campusUrl = this.apiUrl + "getById/" + Campus;
    return this.http.get<any>(campusUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  createCampus(campus: any) {
    let campusUrl = this.apiUrl + "createcampus";
    return this.http.post<any>(campusUrl, campus, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  edit(Campus: any) {
    let campusUrl = this.apiUrl + "editById/" + Campus._id;
    return this.http.post<any>(campusUrl, Campus, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }
  getAllByEcole(id: any) {
    let campusUrl = this.apiUrl + "getAllByEcole/" + id;
    return this.http.get<any>(campusUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }


}
