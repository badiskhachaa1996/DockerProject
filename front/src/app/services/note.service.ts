
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Note } from '../models/Note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  apiUrl = environment.origin + "note/"

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };
  constructor(private httpClient: HttpClient) { }


  //Récuperation de la liste des notes
  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Note[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Récuperation de la liste des notes
  getAllPopulate() {
    let registreUrl = this.apiUrl + "getAllPopulate";
    return this.httpClient.get<Note[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recuperation de la liste des notes par classe
  getAllByClasse(id: string) {
    let registreUrl = this.apiUrl + "getAllByClasse/" + id;
    return this.httpClient.get<Note[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recuperation de la liste des notes via l'id d'un étudiant
  getAllByEtudiantId(id: string) {
    let registreUrl = this.apiUrl + "getAllByEtudiantId/" + id;
    return this.httpClient.get<Note[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recuperation d'une liste de note par semestre via un identifiant etudiant
  getAllByIdBySemestre(id: string, semestre: string) {
    let registreUrl = this.apiUrl + "getAllByIdBySemestre/" + id + "/" + semestre;
    return this.httpClient.get<Note[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recuperation d'une liste de note par semestre et par matière
  getAllByClasseBySemestreByExam(semestre: string, classe: String, exam: string) {
    let registreUrl = this.apiUrl + "getAllByClasseBySemestreByExam/" + semestre + "/" + classe + "/" + exam;
    return this.httpClient.get<Note[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recuperation d'une liste de note par semestre et par classe
  getAllByExamenID(examen_id) {
    let registreUrl = this.apiUrl + "getAllByExamenID/" + examen_id;
    return this.httpClient.get<Note[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  verifNoteByIdBySemestreByExam(id: string, semestre: string, exam: string) {
    let registreUrl = this.apiUrl + "verifNoteByIdBySemestreByExam/" + id + "/" + semestre + "/" + exam;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  //recuperation d'une note via un identifiant
  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Note>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Création d'une note
  create(note: Note) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Note>(registreUrl, note, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  update(note: Note) {
    let registreUrl = this.apiUrl + "updateById/" + note._id;
    return this.httpClient.put<Note>(registreUrl, note, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  updateV2(note: Note) {
    let registreUrl = this.apiUrl + "updateV2/" + note._id;
    return this.httpClient.put<Note>(registreUrl, note, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getPVAnnuel(semestre, classe_id) {
    let url = this.apiUrl + "getPVAnnuel/" + semestre + "/" + classe_id
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  
  getLastPVAnnuel(semestre, classe_id) {
    let url = this.apiUrl + "getLastPV/" + semestre + "/" + classe_id
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  loadPV(semestre, classe_id) {
    let url = this.apiUrl + "loadPV/" + semestre + "/" + classe_id
    return this.httpClient.get<any[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  savePV(semestre, classe_id, data) {
    let url = this.apiUrl + "savePV/" + semestre + "/" + classe_id
    return this.httpClient.post<any>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  deletePV(id){
    let url = this.apiUrl + "deletePV/" + id
    return this.httpClient.delete<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
 
  }

}