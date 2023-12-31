import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Seance } from '../models/Seance';


@Injectable({
  providedIn: 'root'
})
export class SeanceService {

  apiUrl = environment.origin + "seance/"

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  constructor(private httpClient: HttpClient) { }

  //Creation d'une nouvelle séance
  create(seance: Seance) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Seance>(registreUrl, seance, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Creation d'une nouvelle séance
  delete(id) {
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.httpClient.delete<Seance>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getById(id: String) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Seance>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recupération de toute les séances 
  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Seance[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByRange(date_debut: Date, date_fin: Date) {
    let registreUrl = this.apiUrl + "getAllByRange/" + date_debut + "/" + date_fin;
    return this.httpClient.get<Seance>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //mise à jour d'une séance
  update(seance: Seance) {
    let registreUrl = this.apiUrl + "edit/" + seance._id;
    return this.httpClient.post<Seance>(registreUrl, seance, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }


  //recuperation de la liste des séances pour le calendrier
  getEvents() {
    let listeSeance: Seance[];

    let seanceFromDb = this.getAll();
    seanceFromDb.subscribe(
      (data) => { listeSeance = data; },
      (error) => { console.error(error) }
    );

    return listeSeance;

  }
  getAllbyFormateur(id) {
    let registreUrl = this.apiUrl + "getAllbyFormateur/" + id;
    return this.httpClient.get<Seance[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllbyFormateurToday(id) {
    let registreUrl = this.apiUrl + "getAllbyFormateurToday/" + id;
    return this.httpClient.get<Seance[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllByClasseId(id: string) {
    let registreUrl = this.apiUrl + "getAllByClasseId/" + id;
    return this.httpClient.get<Seance[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllFinishedByClasseId(id: string, user_id: string) {
    let registreUrl = this.apiUrl + "getAllFinishedByClasseId/" + id;
    return this.httpClient.post<any>(registreUrl, { user_id }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }


  getAllByDiplomeID(id: string) {
    let registreUrl = this.apiUrl + "getAllByDiplomeID/" + id;
    return this.httpClient.get<Seance[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  convertAllPlanified() {
    let registreUrl = this.apiUrl + "convertAllPlanified";
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getPlanified() {
    let registreUrl = this.apiUrl + "getPlanified";
    return this.httpClient.get<Seance[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  uploadFile(formData, id) {
    let url = this.apiUrl + "uploadFile/" + id
    return this.httpClient.post<any>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) });
  }

  deleteFile(filename, id) {
    let url = this.apiUrl + "deleteFile/" + id + "/" + filename
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) });
  }

  downloadFileCours(filename, id) {
    let url = this.apiUrl + "downloadFile/" + id + "/" + filename
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) });
  }
  getFormateurFromClasseID(classe_id, semestre) {
    let url = this.apiUrl + "getFormateurFromClasseID/" + classe_id + "/" + semestre
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) });
  }

  getFormateursFromClasseIDs(matieres_ids) {
    let url = this.apiUrl + "getFormateursFromClasseIDs"
    return this.httpClient.post<any>(url, { matieres_ids }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) });
  }

  getAllByMatiere(module_id) {
    let url = this.apiUrl + "getAllByMatiere/" + module_id
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) });

  }

  sendMailDelete(deletedSeance: Seance) {
    let url = this.apiUrl + "sendMailDelete"
    return this.httpClient.post<any>(url, { ...deletedSeance }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) });
  }

  sendMailModify(pastSeance: Seance, newSeance: Seance) {
    let url = this.apiUrl + "sendMailModify"
    return this.httpClient.post<any>(url, { pastSeance, newSeance }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) });
  }


}
