import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommercialPartenaire } from '../models/CommercialPartenaire';
import { Prospect } from '../models/Prospect';

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

  //Recuperation de la liste des commercial
  getAllPopulateByPartenaireID(partenaire_id: string) {
    let registreUrl = this.apiurl + "getAllPopulateByPartenaireID/" + partenaire_id;
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


  uploadimageprofile(data: any) {
    let url = this.apiurl + "file";
    return this.httpClient.post<any>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  getProfilePicture(id) {
    let url = this.apiurl + "getProfilePicture/" + id;
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  getByCode(code: string) {
    let url = this.apiurl + "getByCode/" + code;
    return this.httpClient.get<CommercialPartenaire>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })

  }

  newUpdate(data: any) {
    let url = this.apiurl + "newUpdate";
    return this.httpClient.put<CommercialPartenaire>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })

  }

  uploadContrat(formData: FormData, id) {
    let url = this.apiurl + "uploadContrat/" + id
    return this.httpClient.post<CommercialPartenaire>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) });

  }

  downloadContrat(id: string) {
    let url = this.apiurl + "downloadContrat/" + id;
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })

  }
}
