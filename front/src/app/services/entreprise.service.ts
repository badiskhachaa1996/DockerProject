import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Entreprise } from '../models/Entreprise';
import { ContratAlternance } from '../models/ContratAlternance';
import { User } from '../models/User';


@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  apiUrl = environment.origin + "entreprise/";

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  constructor(private httpClient: HttpClient) { }

  //Méthode de recuperation de la liste des entreprises
  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Entreprise[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Creation d'une nouvelle entreprise
  create(entreprise: Entreprise) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Entreprise>(registreUrl, entreprise, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  // Création d'une entreprise et d'un représentant 
  createEntrepriseRepresentant(tbObj: any) {
    let registreUrl = this.apiUrl + "createEntrepriseRepresentant";
    return this.httpClient.post<{ entreprise: Entreprise, representant: User }>(registreUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  // recuperation de la liste des entreprises d'un CEO
  getEntreprisesByIdCEO(id: string): Promise<Entreprise[]> {
    const url = `${this.apiUrl}/get-entreprises-by-id-ceo/${id}`;

    return new Promise<Entreprise[]>((resolve, reject) => {
      this.httpClient.get<Entreprise[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (err) => { reject(err); },
        complete: () => { console.log('liste des entreprises du CEO récuperé') }
      });
    });
  }

  //Recuperation d'une entreprise via un id
  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Entreprise>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  delete(id: string) {
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.httpClient.delete<Entreprise>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recuperation d'une entreprise via un id populate
  getByIdPopulate(id: string) {
    let registreUrl = this.apiUrl + "getByIdPopulate/" + id;
    return this.httpClient.get<Entreprise>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getByDirecteurId(id: string) {
    let registreUrl = this.apiUrl + "getByDirecteurId/" + id;
    return this.httpClient.get<Entreprise>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Modification d'une entreprise
  update(entreprise: Entreprise) {
    let registreUrl = this.apiUrl + "update";
    return this.httpClient.put<Entreprise>(registreUrl, entreprise, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Modification d'une entreprise et de son representant
  updateEntrepriseRepresentant(tbObj: any) {
    let registreUrl = this.apiUrl + "updateEntrepriseRepresentant";
    return this.httpClient.put<any>(registreUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  createNewContrat(objectTosend) {
    let registreUrl = this.apiUrl + "createNewContrat";
    return this.httpClient.post<Entreprise>(registreUrl, objectTosend, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  createContratAlternance(contratAlternance) {
    let registreUrl = this.apiUrl + "createContratAlternance";
    return this.httpClient.post<ContratAlternance>(registreUrl, contratAlternance, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllContratsbyTuteur(idTuteur: string) {
    let registreUrl = this.apiUrl + "getAllContratsbyTuteur/" + idTuteur;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  getContratsByCeo(id: string): Promise<any> {
    const url = `${this.apiUrl}contrats-by-ceo/${id}`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.get<ContratAlternance[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Liste des contrats du ceo récuperés')
      });
    });
  }

  getAllContratsbyEntreprise(entreprise_id: string) {
    let registreUrl = this.apiUrl + "getAllContratsbyEntreprise/" + entreprise_id;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  getAllContratAlternance() {
    let registreUrl = this.apiUrl + "getAllContratAlternance";
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getByEtudiantId(id: string) {
    let registreUrl = this.apiUrl + "getByEtudiantId/" + id;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getByEtudiantIdPopolate(id: string) {
    let registreUrl = this.apiUrl + "getByEtudiantIdPopolate/" + id;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getByIdTuteur(id: string) {
    let registreUrl = this.apiUrl + "getByIdTuteur/" + id;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllContrats() {
    let registreUrl = this.apiUrl + "getAllContrats/";
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  updateContratAlternance(data: ContratAlternance) {
    let url = this.apiUrl + "updateContratAlternance"
    return this.httpClient.post<ContratAlternance>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });;
  }

  // update contract status
  updateStatus(contract: ContratAlternance): Promise<any> {
    const url = `${this.apiUrl}update-status`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.patch<any>(url, contract, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => { resolve(response) },
        error: (error: any) => { reject(error) },
        complete: () => (console.log('Status du contrat mis à jour'))
      });
    });
  }

  // méthode d'envoi du mail vers les entreprises
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
  nettoyageCA() {
    let url = `${this.apiUrl}nettoyageCA`;
    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('Nettoyage complété') }
      });
    });
  }

  // méthode d'upload de cerfa pour les contrats
  uploadCerfa(formData: FormData): Promise<any> {
    const url = `${this.apiUrl}upload-cerfa`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => { resolve(response); },
        error: (error) => { reject(error); },
        complete: () => { console.log('Cerfa envoyé'); }
      });
    });
  }

  // méthode d'upload de la convention de formation pour les contrats
  uploadConvention(formData: FormData): Promise<any> {
    const url = `${this.apiUrl}upload-convention`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => { resolve(response); },
        error: (error) => { reject(error); },
        complete: () => { console.log('Convention envoyé'); }
      });
    });
  }

  // méthode d'upload de l'accord de prise en charge
  uploadAccordPriseEnCharge(formData: FormData): Promise<any> {
    const url = `${this.apiUrl}upload-accord-prise-en-charge`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => { resolve(response); },
        error: (error) => { reject(error); },
        complete: () => { console.log('Accord de prise en charge envoyé'); }
      });
    });
  }

  // méthode d'upload de la résiliation pour les contrats
  uploadResiliation(formData: FormData): Promise<any> {
    const url = `${this.apiUrl}upload-resiliation`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => { resolve(response); },
        error: (error) => { reject(error); },
        complete: () => { console.log('Résiliation envoyé'); }
      });
    });
  }

  // méthode d'upload de la relance pour les contrats
  uploadRelance(formData: FormData): Promise<any> {
    const url = `${this.apiUrl}upload-relance`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => { resolve(response); },
        error: (error) => { reject(error); },
        complete: () => { console.log('Relance envoyé'); }
      });
    });
  }

  // méthode d'upload du livret d'apprentissage
  uploadLivret(formData: FormData): Promise<any> {
    const url = `${this.apiUrl}upload-livret`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => { resolve(response); },
        error: (error) => { reject(error); },
        complete: () => { console.log("Livret d'apprentissage envoyé"); }
      });
    });
  }

  // méthode de téléchargement du cerfa
  getCerfa(idContrat: string): Promise<any> {
    const url = `${this.apiUrl}download-cerfa/${idContrat}`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(url, { responseType: 'blob', headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('Cerfa téléchargé') }
      });
    });
  }

  // méthode de téléchargement de la convention
  getConvention(idContrat: string): Promise<any> {
    const url = `${this.apiUrl}download-convention/${idContrat}`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(url, { responseType: 'blob', headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('Convention téléchargé') }
      });
    });
  }

  // méthode de téléchargement de l'accord de prise en charge
  getAccord(idContrat: string): Promise<any> {
    const url = `${this.apiUrl}download-accord/${idContrat}`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(url, { responseType: 'blob', headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('Accord téléchargé') }
      });
    });
  }

  // méthode de téléchargement de la résiliation
  getResiliation(idContrat: string): Promise<any> {
    const url = `${this.apiUrl}download-resiliation/${idContrat}`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(url, { responseType: 'blob', headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('Résiliation téléchargé') }
      });
    });
  }

  // méthode de téléchargement de la relance
  getRelance(idContrat: string): Promise<any> {
    const url = `${this.apiUrl}download-relance/${idContrat}`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(url, { responseType: 'blob', headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('Relance téléchargé') }
      });
    });
  }

  // méthode de téléchargement du livret d'apprentissage
  getLivret(idContrat: string): Promise<any> {
    const url = `${this.apiUrl}download-livret/${idContrat}`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(url, { responseType: 'blob', headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log("Livret d'apprentissage téléchargé") }
      });
    });
  }

  // méthode de modification d'une remarque faite sur un contrat
  patchRemarque(idContrat: string, remarque: string): Promise<any> {
    const url = `${this.apiUrl}patch-remarque`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.patch<any>(url, { idContrat: idContrat, remarque: remarque }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => { resolve(response) },
        error: (error: any) => { reject(error) },
        complete: () => { console.log('Remarque mis à jour') }
      });
    });
  }

  uploadLogo(data: FormData) {
    let url = this.apiUrl + "uploadLogo";
    return this.httpClient.post<any>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  getLogo(id) {
    let url = this.apiUrl + "getLogo/" + id;
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  getAllLogo() {
    let url = this.apiUrl + "getAllLogo";
    return this.httpClient.get<{ files: {}, ids: string[] }>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

}
