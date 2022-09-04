import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommercialPartenaire } from '../models/CommercialPartenaire';

@Injectable({
  providedIn: 'root'
})
export class CommercialPartenaireService {

  apiurl = environment.origin + "commercialPartenaire/"

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  constructor(private httpClient: HttpClient) { }

  //Recuperation de la liste des commercial
  getAll() {
    let registreUrl = this.apiurl + "getAll";
    return this.httpClient.get<CommercialPartenaire[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllPopulate() {
    let registreUrl = this.apiurl + "getAllPopulate";
    return this.httpClient.get<CommercialPartenaire[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recuperation de la liste des commercial
  getAllByPartenaireID(partenaire_id: string) {
    let registreUrl = this.apiurl + "getAllByPartenaireId/" + partenaire_id;
    return this.httpClient.get<CommercialPartenaire[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recuperation d'un commercial via son identifiant
  getById(id: string) {
    let registreUrl = this.apiurl + "getById/" + id;
    return this.httpClient.get<CommercialPartenaire>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Recuperation d'un commercial via un idUser
  getByUserId(id: string) {
    let registreUrl = this.apiurl + "getByUserId/" + id;
    return this.httpClient.get<CommercialPartenaire>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Creation d'un commercial
  create(tbObj: any) {
    let registreUrl = this.apiurl + "create";
    return this.httpClient.post<any>(registreUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Modification d'un commercial
  update(tbObj: any) {
    let registreUrl = this.apiurl + "update";
    return this.httpClient.put<any>(registreUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getCommercialDataFromCommercialCode(code: string) {
    let registreUrl = this.apiurl + "getCommercialDataFromCommercialCode/" + code;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  delete(id: string) {
    let registreUrl = this.apiurl + "delete/" + id;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

}
