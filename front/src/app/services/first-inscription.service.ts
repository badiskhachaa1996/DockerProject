import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inscription } from '../models/Inscription';


@Injectable({
  providedIn: 'root'
})
export class FirstInscriptionService {
  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' })/*.append('token', localStorage.getItem('token'))*/ };

  apiUrl = environment.origin + "inscription/"

  constructor(private httpClient: HttpClient) { }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Inscription[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Inscription>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getByUser(id: string) {
    let registreUrl = this.apiUrl + "getByUserId/" + id;
    return this.httpClient.get<Inscription>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getByEmail(email: string) {
    let registreUrl = this.apiUrl + "getByEmail/" + email;
    return this.httpClient.get<Inscription>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  create(objNewInscri: any) {
    let registreUrl = this.apiUrl + "firstInscription";
    return this.httpClient.post<any>(registreUrl, objNewInscri, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  updateStatutById(inscription: Inscription, email_perso: string) {
    let registreUrl = this.apiUrl + "editStatutById/" + inscription._id;
    return this.httpClient.post<Inscription>(registreUrl, [inscription, email_perso], { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  uploadFile(data: FormData, id_preins) {
    let url = this.apiUrl + "uploadFile/" + id_preins;
    return this.httpClient.post<any>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }


  getFiles(id: string) {
    let registreUrl = this.apiUrl + "getFilesInscri/" + id;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })

  }
  downloadFile(id, filename: string) {
    let registreUrl = this.apiUrl + "downloadFile/" + id + "/" + filename;
    return this.httpClient.post<any>(registreUrl, filename, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  deletepreinscription(id) {
    let registreUrl = this.apiUrl + "deleteById/" + id;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByCode(code) {
    let registreUrl = this.apiUrl + "getAllByCode/" + code;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }


}
