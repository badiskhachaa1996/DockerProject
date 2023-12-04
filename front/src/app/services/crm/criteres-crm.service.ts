import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/User';
import { Critere } from 'src/app/models/Critere';

@Injectable({
  providedIn: 'root'
})
export class CritereService {


  apiUrl = environment.origin + "critere/";
  constructor(private http: HttpClient) { }

  

  getAllCriteres() {
    let registerUrl = this.apiUrl + 'getAll';
    return this.http.get<Critere[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  critereCreate(data: Critere) {
    let registerUrl = this.apiUrl + 'create';
    return this.http.post<Critere>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  critereUpdate(data: Critere) {
    let registerUrl = this.apiUrl + 'update';
    return this.http.put<Critere>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  critereGetByID(id: string) {
    let registerUrl = this.apiUrl + 'critere/getByID/' + id;
    return this.http.get<Critere>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  critereDelete(id: string) {
    let registerUrl = this.apiUrl + 'delete/' + id;
    return this.http.delete<Critere>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
}
