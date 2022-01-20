import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Alternant } from '../models/Alternant';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
const httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };


@Injectable({
  providedIn: 'root'
})
export class AlternantService {

  apiUrl = environment.origin + "alternant/"

  constructor(private httpClient: HttpClient) { }

  //Methode de création d'un alternant
  create(tbObj: any)
  {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Alternant>(registreUrl, tbObj, httpOptions1);
  }

  //Methode de recuperation de la liste des alternants
  getAll()
  {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Alternant[]>(registreUrl, httpOptions1);
  }

  //Recuperation d'un alternant via son identifiant
  getById(id: string)
  {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Alternant>(registreUrl, httpOptions1);
  }

  //Mis à jour d'un alternant
  update(alternant: Alternant)
  {
    let registreUrl = this.apiUrl + "update";
    return this.httpClient.put<Alternant>(registreUrl, alternant, httpOptions1);
  }
}
