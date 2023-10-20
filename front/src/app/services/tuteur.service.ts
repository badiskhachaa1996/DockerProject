import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tuteur } from '../models/Tuteur';
import { Entreprise } from '../models/Entreprise';
import { User } from '../models/User';
// const io = require("socket.io-client");

@Injectable({
  providedIn: 'root'
})
export class TuteurService {

  apiUrl = environment.origin + "tuteur/"
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) };


  constructor(private httpClient: HttpClient) { }

  //methode d'ajout d'un tuteur
  create(tbObj: any) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<{ tuteur: Tuteur, user: User }>(registreUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  updateById(id: string, tuteur: Tuteur) {
    let registreUrl = this.apiUrl + "updateById/" + id;
    return this.httpClient.post<any>(registreUrl, tuteur, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //recupération des tuteurs par Id Entreprise
  getAllByEntrepriseId(entrepriseId: string) {
    let registreUrl = this.apiUrl + "getAllByEntrepriseId/" + entrepriseId;
    return this.httpClient.get<Tuteur[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //recupération d'un tuteur par Id Entreprise
  getByEntrepriseId(entrepriseId: string) {
    let registreUrl = this.apiUrl + "getByEntrepriseId/" + entrepriseId;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  //récupération d'un tuteur
  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Tuteur>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getByUserId(id: string) {
    let registreUrl = this.apiUrl + "getByUserId/" + id;
    return this.httpClient.get<Tuteur>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getPopulatebyUserID(id: string) {
    let registreUrl = this.apiUrl + "getPopulatebyUserID/" + id;
    return this.httpClient.get<Tuteur>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }



}
