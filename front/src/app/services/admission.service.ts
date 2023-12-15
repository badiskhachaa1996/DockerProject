import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MemberInt } from '../models/memberInt';
import { Prospect } from '../models/Prospect';
import { ProspectAlternable } from '../models/ProspectAlternable';
import { ProspectIntuns } from '../models/ProspectIntuns';
import { HistoriqueLead } from '../models/HistoriqueLead';
import { Observable } from 'rxjs';


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
  create(tbObj: { newProspect: any, newUser: any }) {
    let registerUrl = this.apiUrl + 'create';
    return this.httpClient.post<any>(registerUrl, tbObj, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }
  createticket(ticket) {
    let registreUrl = this.apiUrl + "createticket";
    return this.httpClient.post<any>(registreUrl, ticket, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Modification d'un prospect
  update(tbObj: { prospect: any, user: any }) {
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
    return this.httpClient.get<Prospect>(registreurl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
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
  getAllLocal() {
    let registreUrl = this.apiUrl + 'getAllLocal';
    return this.httpClient.get<Prospect[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllInt() {
    let registreUrl = this.apiUrl + 'getAllInt';
    return this.httpClient.get<Prospect[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllInsDef() {
    let registreUrl = this.apiUrl + 'getAllInsDef';
    return this.httpClient.get<Prospect[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  get100Sourcing() {
    let registreUrl = this.apiUrl + 'get100Sourcing';
    return this.httpClient.get<Prospect[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }


// admission.service.ts

// getLeadsByPartenaireCode(partenaireCode: string): Observable<Prospect[]> {
//   const url = `${this.apiUrl}getLeadsByPartenaireCode/${partenaireCode}`;
//   return this.httpClient.get<Prospect[]>(url, { headers: this.httpOptions1 });
// }



  getAllSourcing() {
    let registreUrl = this.apiUrl + 'getAllSourcing';
    return this.httpClient.get<Prospect[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllOrientation() {
    let registreUrl = this.apiUrl + 'getAllOrientation';
    return this.httpClient.get<Prospect[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllConsulaire() {
    let registreUrl = this.apiUrl + 'getAllConsulaire';
    return this.httpClient.get<Prospect[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllPaiement() {
    let registreUrl = this.apiUrl + 'getAllPaiement';
    return this.httpClient.get<Prospect[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByStatut(statut) {
    let registreUrl = this.apiUrl + 'getAllByStatut/' + statut;
    return this.httpClient.get<Prospect[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllEtudiant() {
    let registreUrl = this.apiUrl + 'getAllEtudiant';
    return this.httpClient.get<Prospect[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByCommercialUserID(id) {
    let registreUrl = this.apiUrl + 'getAllByCommercialUserID/' + id;
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
  
  downloadFilePaiement(id, filename) {
    let url = this.apiUrl + "downloadFilePaiement/" + id + "/" + filename
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  downloadFileAdmin(id, path) {
    let url = this.apiUrl + "downloadFileAdmin/" + id + "/" + path
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }


  deleteFile(id, filename) {
    let url = this.apiUrl + "deleteFile/" + id + "/" + filename
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  uploadFile(formData, id, token = 'token') {
    let url = this.apiUrl + "uploadFile/" + id
    return this.httpClient.post<any>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem(token)) });
  }

  uploadFilePaiement(formData, id, token = 'token') {
    let url = this.apiUrl + "uploadFilePaiement/" + id
    return this.httpClient.post<any>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem(token)) });
  }

  uploadAdminFile(formData, id, token = 'token') {
    let url = this.apiUrl + "uploadAdminFile/" + id
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
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }) })
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

  getByAllAlternance() {
    let url = this.apiUrl + "getByAllAlternance"
    return this.httpClient.get<Prospect[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  createIntuns(data: ProspectIntuns) {
    let url = this.apiUrl + "createIntuns"
    return this.httpClient.post<ProspectIntuns>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }) })
  }
  //recuperation de la liste des admissions
  getAllProspectsIntuns() {
    let registreUrl = this.apiUrl + 'getAllProspectsIntuns';
    return this.httpClient.get<ProspectIntuns[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }


  //* Partie dédiée aux prospects alternances
  // recuperation de la liste des prospects alternables
  getProspectsAlt(): Promise<ProspectAlternable[]> {
    const url = `${this.apiUrl}get-prospects-alt`;
    return new Promise<ProspectAlternable[]>((resolve, reject) => {
      this.httpClient.get<ProspectAlternable[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (success) => { resolve(success); },
        error: (error) => { reject(error); },
        complete: () => { console.log('Liste des leads alternables récupérés'); }
      });
    });
  }

  // recuperation de la liste des prospects alternables via l'id du commercial
  getProspectsAltByComId(id: string): Promise<ProspectAlternable[]> {
    const url = `${this.apiUrl}get-prospects-alt-by-com-id/${id}`;
    return new Promise<ProspectAlternable[]>((resolve, reject) => {
      this.httpClient.get<ProspectAlternable[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (success) => { resolve(success); },
        error: (error) => { reject(error); },
        complete: () => { console.log('Liste des leads alternables du commercial récupérés'); }
      });
    });
  }

  // recuperation d'un prospect alternable via son id
  getProspectAlt(id: string): Promise<ProspectAlternable> {
    const url = `${this.apiUrl}get-prospect-alt`;
    return new Promise<ProspectAlternable>((resolve, reject) => {
      this.httpClient.get<ProspectAlternable>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (success) => { resolve(success); },
        error: (error) => { reject(error); },
        complete: () => { console.log('Leads alternable récupéré'); }
      });
    });
  }

  // creation d'un prospect alternable
  postProspectAlt(obj: any): Promise<any> {
    const url = `${this.apiUrl}post-prospect-alt`;
    return new Promise<any>((resolve, reject) => {
      this.httpClient.post<any[]>(url, obj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (success) => { resolve(success); },
        error: (error) => { reject(error); },
        complete: () => { console.log('Leads alternable crée'); }
      });
    });
  }

  // modification des infos d'un prospect alt
  patchProspectAlt(tbObj: any[]): Promise<any> {
    const url = `${this.apiUrl}patch-prospect-alt`;
    return new Promise<any>((resolve, reject) => {
      this.httpClient.patch<any[]>(url, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (success) => { resolve(success); },
        error: (error) => { reject(error); },
        complete: () => { console.log('Leads alternable modifié'); }
      });
    });
  }

  // méthode d'envoi du lien de generation du formulaire
  sendCreationLink(idCommercial: string, email: string): Promise<any> {
    let url = `${this.apiUrl}send-creation-link`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(url, { idCommercial: idCommercial, email: email }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('Lien générer') }
      });
    });
  }

  envoieMail(mail: string, prospect: Prospect) {
    let url = this.apiUrl + "envoieMail";
    return this.httpClient.post<any>(url, { mail, prospect: prospect._id });
  }

  updateV2(data, detail = "") {
    
    let url = this.apiUrl + "updateV2";
    if (localStorage.getItem('token'))
      return this.httpClient.put<Prospect>(url, { ...data, detail }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
    else
      return this.httpClient.put<Prospect>(url, { ...data, detail });
  }
  updateMany(data, detail = "") {
    let url = this.apiUrl + "updateMany";
    return this.httpClient.put<Prospect[]>(url, { ...data, detail },);
  }
  getAllAffected(team_id = "buffer", agent_id = "buffer") {
    //Toujours avec une valeur dans ces params, car si null il va retourner tous les prospects
    let registreUrl = this.apiUrl + 'getAllAffected/' + agent_id + "/" + team_id;
    return this.httpClient.get<Prospect[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  getAllHistoriqueFromLeadID(id) {
    //Toujours avec une valeur dans ces params, car si null il va retourner tous les prospects
    let registreUrl = this.apiUrl + 'getAllHistoriqueFromLeadID/' + id
    return this.httpClient.get<HistoriqueLead[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  getAllAdmission() {
    //Toujours avec une valeur dans ces params, car si null il va retourner tous les prospects
    let registreUrl = this.apiUrl + 'getAllAdmission';
    return this.httpClient.get<Prospect[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  getDataForDashboardPartenaire(data: any) {
    let registreUrl = this.apiUrl + 'getDataForDashboardPartenaire';
    return this.httpClient.post<{ globalstats: any, activitystats: any }>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getDataForDashboardInternationalBasique() {
    let registreUrl = this.apiUrl + 'getDataForDashboardInternationalBasique';
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }
  getDataForDashboardInternational(data: any) {
    let registreUrl = this.apiUrl + 'getDataForDashboardInternational';
    return this.httpClient.post<any>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getDataForDashboardPerformance(member: MemberInt, filter: any) {
    let registreUrl = this.apiUrl + 'getDataForDashboardPerformance';
    return this.httpClient.post<any>(registreUrl, { member, filter }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getPopulate(id) {
    let registreUrl = this.apiUrl + 'getPopulate/' + id;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  docChecker(input: string) {
    let registreUrl = this.apiUrl + 'docChecker/' + input;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  sendMailAffectation(data) {
    let registreUrl = this.apiUrl + 'sendMailAffectation';
    return this.httpClient.post<any>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  deleteMany(listIds, user_ids) {
    let registreUrl = this.apiUrl + 'deleteMany';
    return this.httpClient.post<any>(registreUrl, { listIds, user_ids }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }





// une méthode dans votre service pour récupérer l'utilisateur connecté

getUserById(userId: string): Observable<any> {
  const url = `${this.apiUrl}getconnectedById/${userId}`;
  return this.httpClient.get<any>(url,  { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
}


// une méthode pour récupérer les leads du partenaire :

getLeadsByCodePartenaire(codePartenaire: string): Observable<any[]> {
  const url = `${this.apiUrl}/getAllByCodeCommercial/${codePartenaire}`;
  return this.httpClient.get<any[]>(url,  { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
}
}




