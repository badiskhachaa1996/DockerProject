import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Examen } from '../models/Examen';
import { Formateur } from '../models/Formateur';
import { Matiere } from '../models/Matiere';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {

  apiUrl = environment.origin + "examen/"

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  constructor(private httpClient: HttpClient) { }

  //Récuperation de la liste des examens
  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Examen[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Récuperation de la liste des examens
  getAllPopulate() {
    let registreUrl = this.apiUrl + "getAllPopulate";
    return this.httpClient.get<any[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Récuperation de la liste des examens
  getAllByFormateurID(formateur_id) {
    let registreUrl = this.apiUrl + "getAllByFormateurID/" + formateur_id;
    return this.httpClient.get<Examen[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Récuperation de la liste des evaluations
  getAllEvaluation() {
    let registreUrl = this.apiUrl + "getAllEvaluation";

    return this.httpClient.get<Examen[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //recuperation d'un examen via un identifiant
  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Examen>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByClasseId(id: string) {
    let registreUrl = this.apiUrl + "getAllByClasseId/" + id;
    return this.httpClient.get<Examen[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Création d'un examen
  create(examen: Examen) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Examen>(registreUrl, examen, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  update(examen: Examen) {
    let registreUrl = this.apiUrl + "updateById/" + examen._id;
    return this.httpClient.put<Examen>(registreUrl, examen, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getModulesByGroupeID(classe_id) {
    let url = this.apiUrl + "getModulesByGroupeID/" + classe_id
    return this.httpClient.get<Matiere[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }


  getFormateurByModuleID(module_id) {
    let url = this.apiUrl + "getFormateurByModuleID/" + module_id
    return this.httpClient.get<Formateur[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAppreciation(semestre, classe_id, formateur_id) {
    let url = this.apiUrl + "getAppreciation/" + semestre + "/" + classe_id + "/" + formateur_id
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  delete(id) {
    let url = this.apiUrl + "delete/" + id
    return this.httpClient.delete<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  correctionSemestre(examen_id, semestre) {
    let url = this.apiUrl + "correctionSemestre/" + examen_id + "/" + semestre
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

}
