import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Entreprise } from '../models/Entreprise';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
const httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };


@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  apiUrl = environment.origin + "entreprise/"

  constructor(private httpClient: HttpClient) { }

  //Methode de recuperation de la liste des entreprises
  getAll()
  {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Entreprise[]>(registreUrl, httpOptions1);
  }

  //Creation d'une nouvelle entreprise
  create(entreprise: Entreprise)
  {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Entreprise>(registreUrl, entreprise, httpOptions1);
  }

  //Recuperation d'une entreprise via un id
  getById(id: string)
  {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Entreprise>(registreUrl, httpOptions1);
  }

  //Modification d'une entreprise
  update(entreprise: Entreprise)
  {
    let registreUrl = this.apiUrl + "update";
    return this.httpClient.put<Entreprise>(registreUrl, entreprise, httpOptions1);
  }
  
}
