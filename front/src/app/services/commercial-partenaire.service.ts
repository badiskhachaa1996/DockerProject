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
    return this.httpClient.get<CommercialPartenaire[]>(registreUrl, this.httpOptions1);
  }

  //Recuperation de la liste des commercial
  getAllByPartenaireID(partenaire_id: string) {
    let registreUrl = this.apiurl + "getAllByPartenaireId/"+partenaire_id;
    return this.httpClient.get<CommercialPartenaire[]>(registreUrl, this.httpOptions1);
  }

  //Recuperation d'un commercial via son identifiant
  getById(id: string) {
    let registreUrl = this.apiurl + "getById/" + id;
    return this.httpClient.get<CommercialPartenaire>(registreUrl, this.httpOptions1);
  }

  //Recuperation d'un commercial via un idUser
  getByUserId(id: string) {
    let registreUrl = this.apiurl + "getByUserId/" + id;
    return this.httpClient.get<CommercialPartenaire>(registreUrl, this.httpOptions1);
  }

  //Creation d'un commercial
  create(tbObj: any) {
    let registreUrl = this.apiurl + "create";
    return this.httpClient.post<any>(registreUrl, tbObj, this.httpOptions1);
  }

  //Modification d'un commercial
  update(tbObj: any) {
    let registreUrl = this.apiurl + "update";
    return this.httpClient.put<any>(registreUrl, tbObj, this.httpOptions1);
  }

  getCommercialDataFromCommercialCode(code:string){
    let registreUrl = this.apiurl + "getCommercialDataFromCommercialCode/"+code;
    return this.httpClient.get<any>(registreUrl, this.httpOptions1);
  }

}
