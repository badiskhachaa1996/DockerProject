import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Prospect } from '../models/Prospect';
import { ProspectIntuns } from '../models/ProspectIntuns';


@Injectable({
  providedIn: 'root'
})
export class AdmissionService {

  apiUrl = environment.origin + "prospect/";

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) };
  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };
  constructor(private httpClient: HttpClient) {
  }

  //Création d'un nouveau prospect
  create(tbObj: any) {
    let registerUrl = this.apiUrl + 'create';
    return this.httpClient.post<any>(registerUrl, tbObj, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  //Modification d'un prospect
  update(tbObj: any) {
    let registreUrl = this.apiUrl + 'update';
    return this.httpClient.put<any>(registreUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recuperation d'un prospect via son id
  getById(id: string) {
    let registreurl = this.apiUrl + 'getById/' + id;
    return this.httpClient.get<any>(registreurl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  ValidateEmail(email) {
    let registreurl = this.apiUrl + "ValidateEmail/" + email
    return this.httpClient.get<any>(registreurl, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  //Recuperation d'un prospect via son userId
  getByUserId(user_id: string) {
    let registreurl = this.apiUrl + 'getByUserId/' + user_id;
    return this.httpClient.get<Prospect>(registreurl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getTokenByUserId(user_id: string) {
    let registreurl = this.apiUrl + 'getTokenByUserId/' + user_id;
    return this.httpClient.get<any>(registreurl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }


  //recuperation de la liste des admissions
  getAll() {
    let registreUrl = this.apiUrl + 'getAll';
    return this.httpClient.get<Prospect[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllEtudiant() {
    let registreUrl = this.apiUrl + 'getAllEtudiant';
    return this.httpClient.get<Prospect[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }



  updateStatut(id_prospect, p) {
    let url = this.apiUrl + "updateStatut/" + id_prospect
    return this.httpClient.post<Prospect>(url, p, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }



  getFiles(id: any) {
    let url = this.apiUrl + "getFilesInscri/" + id
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  downloadFile(id, filename) {
    let url = this.apiUrl + "downloadFile/" + id + "/" + filename
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  deleteFile(id, filename) {
    let url = this.apiUrl + "deleteFile/" + id + "/" + filename
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  uploadFile(formData, id, token = 'token') {
    let url = this.apiUrl + "uploadFile/" + id
    return this.httpClient.post<any>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem(token)) });
  }

  getAllCodeCommercial(code) {
    let registreUrl = this.apiUrl + "getAllByCodeCommercial/" + code;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllByCodeAdmin(partenaire_id) {
    let registreUrl = this.apiUrl + "getAllByCodeAdmin/" + partenaire_id;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllWait() {
    let registreUrl = this.apiUrl + 'getAllWait';
    return this.httpClient.get<Prospect[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  addNewPayment(id, body) {
    let url = this.apiUrl + "updatePayement/" + id
    return this.httpClient.post<Prospect>(url, body, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) })
  }

  changeEtatTraitement(id, etat = "Vu", token = 'token') {
    let url = this.apiUrl + "etatTraitement/" + id + "/" + etat
    return this.httpClient.get<Prospect>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem(token)) })
  }

  getInfoDashboardAdmission() {
    let url = this.apiUrl + "getInfoDashboardAdmission";
    return this.httpClient.get<{ nb_all_etudiant: number, nb_nouvelle_inscrit: number, nb_retour_etudiant: number }>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  createProspectWhileEtudiant(user_id) {
    let url = this.apiUrl + "createProspectWhileEtudiant/" + user_id
    return this.httpClient.get<Prospect>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) })
  }

  getPopulateByUserid(user_id) {
    let url = this.apiUrl + "getPopulateByUserid/" + user_id
    return this.httpClient.get<Prospect>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) })
  }

  updateDossier(id, statut_dossier) {
    let url = this.apiUrl + "updateDossier/" + id + "/" + statut_dossier
    return this.httpClient.get<Prospect>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) })
  }

  delete(p_id, user_id) {
    let url = this.apiUrl + "delete/" + p_id + "/" + user_id
    return this.httpClient.get<Prospect>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) })
  }

  updateVisa(p_id, visa: boolean) {
    let url = this.apiUrl + "updateVisa"
    return this.httpClient.post<Prospect>(url, { p_id, statut: visa }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }) })
  }

  createIntuns(data: ProspectIntuns){
    let url = this.apiUrl + "createIntuns"
    return this.httpClient.post<ProspectIntuns>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }) })
 
  }
}
