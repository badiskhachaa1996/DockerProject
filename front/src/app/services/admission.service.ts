import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Prospect } from '../models/Prospect';


@Injectable({
  providedIn: 'root'
})
export class AdmissionService {

  apiUrl = environment.origin + "prospect/";

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) };
  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };
  constructor(private httpClient: HttpClient) {
    this.httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };
  }

  //Création d'un nouveau prospect
  create(tbObj: any) {
    let registerUrl = this.apiUrl + 'create';
    return this.httpClient.post<any>(registerUrl, tbObj, this.httpOptions);
  }

  //Modification d'un prospect
  update(tbObj: any) {
    let registreUrl = this.apiUrl + 'update';
    return this.httpClient.put<any>(registreUrl, tbObj, this.httpOptions1);
  }

  //Recuperation d'un prospect via son id
  getById(id: string) {
    let registreurl = this.apiUrl + 'getById/' + id;
    return this.httpClient.get<any>(registreurl, this.httpOptions1);
  }

  ValidateEmail(email) {
    let registreurl = this.apiUrl + "ValidateEmail/" + email
    return this.httpClient.get<any>(registreurl, this.httpOptions);
  }

  //Recuperation d'un prospect via son userId
  getByUserId(id: string) {
    let registreurl = this.apiUrl + 'getByUserId/' + id;
    return this.httpClient.get<any>(registreurl, this.httpOptions1);
  }

  //recuperation de la liste des admissions
  getAll() {
    let registreUrl = this.apiUrl + 'getAll';
    return this.httpClient.get<Prospect[]>(registreUrl, this.httpOptions1);
  }

  updateStatut(id_prospect, p) {
    let url = this.apiUrl + "updateStatut/" + id_prospect
    return this.httpClient.post<Prospect>(url, p, this.httpOptions1);
  }



  getFiles(id: any) {
    let url = this.apiUrl + "getFilesInscri/" + id
    return this.httpClient.get<any>(url, this.httpOptions);
  }

  downloadFile(id, filename) {
    let url = this.apiUrl + "downloadFile/" + id + "/" + filename
    return this.httpClient.get<any>(url, this.httpOptions1);
  }

  deleteFile(id, filename) {
    let url = this.apiUrl + "deleteFile/" + id + "/" + filename
    return this.httpClient.get<any>(url, this.httpOptions1);
  }

  uploadFile(formData, id) {
    let url = this.apiUrl + "uploadFile/" + id
    return this.httpClient.post<any>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) });
  }

  getAllCodeCommercial(code) {
    let registreUrl = this.apiUrl + "getAllByCodeCommercial/" + code;
    return this.httpClient.get<any>(registreUrl, this.httpOptions1);
  }
  getAllByCodeAdmin(partenaire_id) {
    let registreUrl = this.apiUrl + "getAllByCodeAdmin/" + partenaire_id;
    return this.httpClient.get<any>(registreUrl, this.httpOptions1);
  }

  getAllWait() {
    let registreUrl = this.apiUrl + 'getAllWait';
    return this.httpClient.get<Prospect[]>(registreUrl, this.httpOptions1);
  }
}
