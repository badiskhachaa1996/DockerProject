import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Formateur } from '../models/Formateur';


@Injectable({
  providedIn: 'root'
})
export class FormateurService {

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  apiUrl = environment.origin + "formateur/"

  constructor( private httpClient: HttpClient ) { }

  //Methode de recuperation de la liste des formateurs
  getAll()
  {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Formateur[]>(registreUrl, this.httpOptions1);
  }

  //Methode de recuperation d'un formateur via son id formateur
  getById(id: string)
  {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Formateur>(registreUrl, this.httpOptions1);
  }

  //Recupère un formateur via son user_id
  getByUserId(id: string)
  {
    let registreUrl = this.apiUrl + "getByUserId/" + id;
    return this.httpClient.get<Formateur>(registreUrl, this.httpOptions1);
  }

  //création d'un formateur
  create(tbObj: any)
  {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<any>(registreUrl, tbObj, this.httpOptions1);
  }

  //Met à jour un formateur via son idFormateur
  updateById(formateur: Formateur)
  {
    let registreUrl = this.apiUrl + "updateById/" + formateur._id;
    return this.httpClient.post<any>(registreUrl, formateur, this.httpOptions1);
  }

  getAllUser(){
    return this.httpClient.get(this.apiUrl+"getAllUser",this.httpOptions1)
  }

  updateMatiere(formateur,data){
    return this.httpClient.post(this.apiUrl+"updateVolume/"+formateur._id,data,this.httpOptions1)
  }

  sendEDT(id, update = "/nope") {
    let registreUrl = this.apiUrl + "sendEDT/" + id+update;
    return this.httpClient.get<any>(registreUrl, this.httpOptions1);
  }

  getFiles(id:any) {
    let url = this.apiUrl + "getFiles/" + id
    return this.httpClient.get<any>(url, this.httpOptions1);
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
    return this.httpClient.post<any>(url, formData, this.httpOptions1);
  }

}
