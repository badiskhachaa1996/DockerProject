import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tuteur } from '../models/Tuteur';
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
    console.log(tbObj);
    return this.httpClient.post<Tuteur>(registreUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  updateById(id:string, tuteur : Tuteur){
    let registreUrl = this.apiUrl + "updateById/" + id; 
    console.log('service')
    return this.httpClient.post<any>(registreUrl, tuteur, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //recupération des tuteurs par Id Entreprise
  getAllByEntrepriseId(entrepriseId: string) {
    console.log('service' + entrepriseId)
    let registreUrl = this.apiUrl + "getAllByEntrepriseId/" + entrepriseId;
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



}
