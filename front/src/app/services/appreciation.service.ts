
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Appreciation } from '../models/Appreciation';


@Injectable({
  providedIn: 'root'
})
export class AppreciationService {

  apiUrl = environment.origin + "appreciation/"

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  constructor(private httpClient: HttpClient) { }


  //recuperation de la liste des appreciations
  getAll() 
  {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Appreciation[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recupertaion d'une appreciation
  get(etudiant_id: string, semestre: string)
  {
    let registreUrl = this.apiUrl + "get/" + etudiant_id + "/" + semestre;
    return this.httpClient.get<Appreciation>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Ajout d'une nnouvelle appréciation générale
  create(appreciation: Appreciation)
  {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Appreciation>(registreUrl, appreciation, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Mise à jour d'une appreciation
  update(appreciation: Appreciation)
  {
    let registreUrl = this.apiUrl + "updateById/" + appreciation._id;
    return this.httpClient.put<Appreciation>(registreUrl, appreciation, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

}
