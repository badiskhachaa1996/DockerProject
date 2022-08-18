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

  getById(id: String) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Seance>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recupération de toute les séances 
  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Seance[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
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

  getAllByClasseId(id: string) {
    let registreUrl = this.apiUrl + "getAllByClasseId/" + id;
    return this.httpClient.get<Seance[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
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
  getFormateurFromClasseID(classe_id, semestre){
    let url = this.apiUrl + "getFormateurFromClasseID/" + classe_id + "/" + semestre
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) });
  }


}
