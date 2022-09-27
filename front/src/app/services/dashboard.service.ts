import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Dashboard } from '../models/Dashboard';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  apiUrl =  environment.origin + "dashboard/"

  constructor(private httpClient: HttpClient) { }

  create(tbObj: Dashboard) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Dashboard>(registreUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getByUserID(user_id) {
    let registreUrl = this.apiUrl + "getByUserID/" + user_id;
    return this.httpClient.get<Dashboard>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  addLinks(_id, links) {
    let registreUrl = this.apiUrl + "addLinks/" + _id;
    return this.httpClient.post<Dashboard>(registreUrl, { links }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
