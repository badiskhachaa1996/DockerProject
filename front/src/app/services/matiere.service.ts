import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Matiere } from '../models/Matiere';


@Injectable({
  providedIn: 'root'
})
export class MatiereService {

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  apiUrl = environment.origin + "matiere/"

  constructor(private httpClient: HttpClient) { }

  //Creation d'une nouvelle matière
  create(matiere: Matiere) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Matiere>(registreUrl, matiere, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recuperation de la liste des matieres
  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Matiere[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Obtenir la liste des matieres via un id diplome
  getAllByDiplome(id: string) {
    let registreUrl = this.apiUrl + "getAllByDiplome/" + id;
    return this.httpClient.get<Matiere[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Methode de recuperation d'une matière bia son id
  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Matiere>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  updateById(matiere: Matiere) {
    let registreUrl = this.apiUrl + "updateById";
    return this.httpClient.post<Matiere>(registreUrl, matiere, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getMatiereList() {
    let registreUrl = this.apiUrl + "getMatiereList";
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getDicMatiere() {
    let registreUrl = this.apiUrl + "getDicMatiere";
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getVolume() {
    let registreUrl = this.apiUrl + "getAllVolume";
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByFormateurID(formateur_id) {
    let registreUrl = this.apiUrl + "getAllByFormateurID/" + formateur_id;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }
}
