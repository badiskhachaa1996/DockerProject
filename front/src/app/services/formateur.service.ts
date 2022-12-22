import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Formateur } from '../models/Formateur';
import { Seance } from '../models/Seance';
import { User } from '../models/User';


@Injectable({
  providedIn: 'root'
})
export class FormateurService {

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  apiUrl = environment.origin + "formateur/"

  constructor(private httpClient: HttpClient) { }

  //Methode de recuperation de la liste des formateurs
  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Formateur[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Methode de recuperation de la liste des formateurs
  getAllPopulate() {
    let registreUrl = this.apiUrl + "getAllPopulate";
    return this.httpClient.get<Formateur[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Methode de recuperation d'un formateur via son id formateur
  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Formateur>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recupère un formateur via son user_id
  getByUserId(id: string) {
    let registreUrl = this.apiUrl + "getByUserId/" + id;
    return this.httpClient.get<Formateur>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //création d'un formateur
  create(tbObj: any) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<any>(registreUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Met à jour un formateur via son idFormateur
  updateById(formateur: Formateur) {
    let registreUrl = this.apiUrl + "updateById/" + formateur._id;
    return this.httpClient.post<any>(registreUrl, formateur, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllUser() {
    return this.httpClient.get(this.apiUrl + "getAllUser", { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  updateMatiere(formateur, data) {
    return this.httpClient.post(this.apiUrl + "updateVolume/" + formateur._id, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  sendEDT(id, update = "/nope", mailcustom = "") {
    let registreUrl = this.apiUrl + "sendEDT/" + id + update;
    return this.httpClient.post<any>(registreUrl, { mailcustom }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getFiles(id: any) {
    let url = this.apiUrl + "getFiles/" + id
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  downloadFile(id, filename) {
    let url = this.apiUrl + "downloadFile/" + id + "/" + filename
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  deleteFile(id, filename) {
    let url = this.apiUrl + "deleteFile/" + id + "/" + filename
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  uploadFile(formData, id) {
    let url = this.apiUrl + "uploadFile/" + id
    return this.httpClient.post<any>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllInfos(mois: Number, year: Number) {
    let url = `${this.apiUrl}getAllInfos/${mois}/${year}`
    return this.httpClient.get<[{ formateur_id: User, mois: Number, nombre_heure: Number, rapport: [{ seance: Seance, rapport: any }] }]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

}
