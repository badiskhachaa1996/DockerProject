import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PointageData } from '../models/PointageData';

@Injectable({
  providedIn: 'root'
})
export class PointageService {
  apiUrl = environment.origin + "pointage/"
  constructor(private httpClient: HttpClient) { }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<PointageData[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllToday() {
    let registreUrl = this.apiUrl + "getAllToday";
    return this.httpClient.get<PointageData[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
