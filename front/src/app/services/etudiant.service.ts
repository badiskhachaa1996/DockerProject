import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Etudiant } from '../models/Etudiant';

const httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {

  apiUrl = environment.origin + "etudiant/"

  constructor(private httpClient: HttpClient) { }

    //Methode de création d'un etudiant
    create(tbObj: any)
    {
      let registreUrl = this.apiUrl + "create";
      return this.httpClient.post<any>(registreUrl, tbObj, httpOptions1);
    }
  
    //Methode de recuperation de la liste des etudiants
    getAll()
    {
      let registreUrl = this.apiUrl + "getAll";
      return this.httpClient.get<any[]>(registreUrl, httpOptions1);
    }
  
    //Recuperation d'un etudiant via son identifiant
    getById(id: string)
    {
      let registreUrl = this.apiUrl + "getById/" + id;
      return this.httpClient.get<Etudiant>(registreUrl, httpOptions1);
    }
  
    //Recuperation d'un etudiant via son user_id
    getByUser_id(user_id: string)
    {
      let registreUrl = this.apiUrl + "getByUserid/" + user_id;
      return this.httpClient.get<any>(registreUrl, httpOptions1);
    }
  
    //Mis à jour d'un etudiant
    update(etudiant: Etudiant)
    {
      let registreUrl = this.apiUrl + "update";
      return this.httpClient.put<Etudiant>(registreUrl, etudiant, httpOptions1);
    }

    //recuperation des étudiants via un id de classe
    getAllByClasseId(id: string)
    {
      let registreUrl = this.apiUrl + "getAllByClasseId/" + id;
      return this.httpClient.get<Etudiant[]>(registreUrl, httpOptions1);
    }

    exportAsAlternant(tbObj: any)
    {
      let registreUrl = this.apiUrl + "export";
      return this.httpClient.post<any>(registreUrl, tbObj, httpOptions1);
    }
    createfromPreinscris(etd:Etudiant)
    {
      let registreUrl=this.apiUrl+"createfromPreinscrit";
      return this.httpClient.post<any>(registreUrl, etd,httpOptions1);
    }

    sendEDT(id, update = "/nope") {
      let registreUrl = this.apiUrl + "sendEDT/" + id+"/"+update;
      return this.httpClient.get<any>(registreUrl, httpOptions1);
    }

    getBulletin(etudiant_id,semestre){
      let registreUrl = this.apiUrl + "getBulletin/" + etudiant_id+"/"+semestre;
      return this.httpClient.get<any>(registreUrl, httpOptions1);
    }

    getAllByCode(code){
      let registreUrl=this.apiUrl+"getAllByCode/"+code;
      return this.httpClient.get<any>(registreUrl,httpOptions1);
    }

    
  getFiles(id:any) {
    let url = this.apiUrl + "getFiles/" + id
    return this.httpClient.get<any>(url, httpOptions1);
  }

  downloadFile(id, filename) {
    let url = this.apiUrl + "downloadFile/" + id + "/" + filename
    return this.httpClient.get<any>(url, httpOptions1);
  }

  deleteFile(id, filename) {
    let url = this.apiUrl + "deleteFile/" + id + "/" + filename
    return this.httpClient.get<any>(url, httpOptions1);
  }

  uploadFile(formData, id) {
    let url = this.apiUrl + "uploadFile/" + id
    return this.httpClient.post<any>(url, formData, httpOptions1);
  }
  
}
