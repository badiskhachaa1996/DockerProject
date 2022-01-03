import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Formateur } from '../models/Formateur';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
const httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };


@Injectable({
  providedIn: 'root'
})
export class FormateurService {

  apiUrl = environment.origin + "formateur/"

  constructor( private httpClient: HttpClient ) { }

  //Methode de recuperation de la liste des formateurs
  getAll()
  {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Formateur[]>(registreUrl, httpOptions1);
  }

  //Methode de recuperation d'un formateur via son id formateur
  getById(id: string)
  {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Formateur>(registreUrl, httpOptions1);
  }

  //Recupère un formateur via son user_id
  getByUserId(id: string)
  {
    let registreUrl = this.apiUrl + "getByUserId/" + id;
    return this.httpClient.get<Formateur>(registreUrl, httpOptions1);
  }

  //création d'un formateur
  create(tbObj: any)
  {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<any>(registreUrl, tbObj, httpOptions1);
  }

  //Met à jour un formateur via son idFormateur
  updateById(formateur: Formateur)
  {
    let registreUrl = this.apiUrl + "updateById/" + formateur._id;
    return this.httpClient.post<any>(registreUrl, formateur, httpOptions1);
  }

  getAllUser(){
    return this.httpClient.get(this.apiUrl+"getAllUser",httpOptions1)
  }

}
