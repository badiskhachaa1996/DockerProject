import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Etudiant } from '../models/Etudiant';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {

  apiUrl = environment.origin + "etudiant/"

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  constructor(private httpClient: HttpClient) { }

  //Methode de création d'un etudiant
  create(tbObj: any) {
    console.log("service", tbObj)
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<any>(registreUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Methode de recuperation de la liste des etudiants
  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<any[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllEtudiantPopulate() {
    let registreUrl = this.apiUrl + "getAllEtudiantPopulate";
    return this.httpClient.get<Etudiant[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllAlternants() {
    let registreUrl = this.apiUrl + "getAllAlternants";
    return this.httpClient.get<any[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  getAllWait() {
    let registreUrl = this.apiUrl + "getAllWait";
    return this.httpClient.get<any[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recuperation d'un etudiant via son identifiant
  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Etudiant>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recuperation d'un etudiant via son identifiant
  getPopulateByUserid(id: string) {
    let registreUrl = this.apiUrl + "getPopulateByUserid/" + id;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recuperation d'un etudiant via son user_id
  getByUser_id(user_id: string) {
    let registreUrl = this.apiUrl + "getByUserid/" + user_id;
    return this.httpClient.get<Etudiant>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Mis à jour d'un etudiant
  update(etudiant: Etudiant) {
    let registreUrl = this.apiUrl + "update";
    return this.httpClient.post<Etudiant>(registreUrl, etudiant, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  // ajouter le droit d'acces au document ajouter 
  setFileRight(idetudiant, fileright: any, bool: boolean) {
    let registreUrl = this.apiUrl + "setFileRight/" + idetudiant;
    return this.httpClient.post<object>(registreUrl, [idetudiant, fileright.name, bool], { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //recuperation des étudiants via un id de classe
  getAllByClasseId(id: string) {
    let registreUrl = this.apiUrl + "getAllByClasseId/" + id;
    return this.httpClient.get<Etudiant[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  exportAsAlternant(tbObj: any) {
    let registreUrl = this.apiUrl + "export";
    return this.httpClient.post<any>(registreUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  assignToGroupe(data: { _id: string, groupe: string }) {
    let registreUrl = this.apiUrl + "assignToGroupe";
    return this.httpClient.post<any>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  sendEDT(id, update = "/nope") {
    let registreUrl = this.apiUrl + "sendEDT/" + id + "/" + update;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getBulletin(etudiant_id, semestre) {
    let registreUrl = this.apiUrl + "getBulletinV3/" + etudiant_id + "/" + semestre;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getBulletinAnnuel(etudiant_id) {
    let registreUrl = this.apiUrl + "getBulletinAnnuel/" + etudiant_id;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByCode(code) {
    let registreUrl = this.apiUrl + "getAllByCode/" + code;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
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
  getAllByMultipleClasseID(classes_id: string[]) {
    let url = this.apiUrl + "getAllByMultipleClasseID"
    return this.httpClient.post<any[]>(url, { classe_id: classes_id }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  addNewPayment(_id: string, data: any) {
    let url = this.apiUrl + "addNewPayment/" + _id
    return this.httpClient.post<Etudiant>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  validateProspect(data: Etudiant, user_id) {
    let url = this.apiUrl + "validateProspect/" + user_id
    return this.httpClient.post<Etudiant>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  updateDossier(etudiant_id, statut_dossier) {
    let url = this.apiUrl + "updateDossier/" + etudiant_id + "/" + statut_dossier
    return this.httpClient.get<Etudiant>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllWaitForVerif() {
    let registreUrl = this.apiUrl + "getAllWaitForVerif";
    return this.httpClient.get<Etudiant[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllWaitForCreateAccount() {
    let registreUrl = this.apiUrl + "getAllWaitForCreateAccount";
    return this.httpClient.get<Etudiant[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  assignEmail(etudiant_id, email_ims) {
    let registreUrl = this.apiUrl + "assignEmail/" + etudiant_id + "/" + email_ims;
    return this.httpClient.get<Etudiant>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  downloadBulletin(etudiant_id) {
    let registreUrl = this.apiUrl + "downloadBulletin/" + etudiant_id;
    return this.httpClient.get<Etudiant>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  disable(etudiant:Etudiant){
    let registreUrl = this.apiUrl + "disable/" + etudiant._id;
    return this.httpClient.get<Etudiant>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }
}
