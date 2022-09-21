import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Entreprise } from '../models/Entreprise';
import { ContratAlternance } from '../models/ContratAlternance';


@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  apiUrl = environment.origin + "entreprise/";

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  constructor(private httpClient: HttpClient) { }

  //Methode de recuperation de la liste des entreprises
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
    return this.httpClient.post<any>(registreUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recuperation d'une entreprise via un id
  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
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
    return this.httpClient.put<Entreprise>(registreUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
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
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });;
  }

  updateContratAlternance(data:ContratAlternance) {
    let url = this.apiUrl + "updateContratAlternance"
    return this.httpClient.post<ContratAlternance>(url,data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });;
  }

}
