import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Examen } from '../models/Examen';

const httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

@Injectable({
  providedIn: 'root'
})
export class ExamenService {

  apiUrl = environment.origin + "examen/"

  constructor(private httpClient: HttpClient) { }

  //Récuperation de la liste des examens
  getAll()
  {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Examen[]>(registreUrl, httpOptions1);
  }

  //Récuperation de la liste des evaluations
  getAllEvaluation()
  {
    let registreUrl = this.apiUrl + "getAllEvaluation";
    return this.httpClient.get<Examen[]>(registreUrl, httpOptions1);
  }

  //recuperation d'un examen via un identifiant
  getById(id: string)
  {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Examen>(registreUrl, httpOptions1);
  }

  getAllByClasseId(id: string)
  {
    let registreUrl = this.apiUrl + "getAllByClasseId/" + id;
    return this.httpClient.get<Examen[]>(registreUrl, httpOptions1);
  }

  //Création d'un examen
  create(examen: Examen)
  {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Examen>(registreUrl, examen, httpOptions1);
  }

  update(examen: Examen)
  {
    let registreUrl = this.apiUrl + "updateById/" + examen._id;
    return this.httpClient.put<Examen>(registreUrl, examen, httpOptions1);
  }

}
