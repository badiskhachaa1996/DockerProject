import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Inscription } from '../models/Inscription';
import { User } from '../models/User';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
const httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };


@Injectable({
  providedIn: 'root'
})
export class FirstInscriptionService {
  
  apiUrl = environment.origin +"inscription/"

  constructor(private httpClient: HttpClient) { }

  getAll()
  {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Inscription[]>(registreUrl, httpOptions1);
  }
  getById(id: string)
  {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Inscription>(registreUrl, httpOptions1);
  }
  getByUserId(id: string)
  {
    let registreUrl = this.apiUrl + "getByUserId/" + id;
    return this.httpClient.get<Inscription>(registreUrl, httpOptions1);
  }
  create(objNewInscri:any)
  {
    let registreUrl = this.apiUrl + "firstInscription";
    return this.httpClient.post<any>(registreUrl, objNewInscri, httpOptions1);
  }
  updateById(inscription: Inscription)
  {
    let registreUrl = this.apiUrl + "updateById/" + inscription._id;
    return this.httpClient.post<Inscription>(registreUrl, inscription, httpOptions1);
  }

}
