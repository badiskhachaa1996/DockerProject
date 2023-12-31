import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Classe } from '../models/Classe';
import { Matiere } from '../models/Matiere';



@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  apiUrl = environment.origin + "classe/"
  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };
  constructor(private http: HttpClient) { }

  create(classe: Classe) {
    let registreUrl = this.apiUrl + "create";
    return this.http.post<Classe>(registreUrl, classe, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  update(classe: Classe) {
    let registreUrl = this.apiUrl + "updateById/";
    return this.http.post<Classe>(registreUrl, classe, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  get(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.http.get<Classe>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getPopulate(id: string) {
    let registreUrl = this.apiUrl + "getPopulate/" + id;
    return this.http.get<Classe>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.http.get<Classe[]>(registreUrl);
  }

  getAllPopulate() {
    let registreUrl = this.apiUrl + "getAllPopulate";
    return this.http.get<Classe[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  //recupération d'une classe par IdUser
  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.http.get<Classe>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  hide(id: any) {
    let registreUrl = this.apiUrl + "hideById/" + id;
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  show(id: any) {
    let registreUrl = this.apiUrl + "showById/" + id;
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  seeAll() {
    let registreUrl = this.apiUrl + "seeAll";
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByDiplomeABBRV(abbrv) {
    let url = this.apiUrl + "getALLByDiplomeABBRV/" + abbrv
    return this.http.get<Classe[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByFormateurID(formateur_id) {
    let url = this.apiUrl + "getAllByFormateurID/" + formateur_id
    return this.http.get<Classe[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  // upload du calendrier de la formation
  uploadCalendar(formData: FormData): Promise<any> {
    const url = `${this.apiUrl}upload-calendar`;

    return new Promise<any>((resolve, reject) => {
      this.http.post(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => { resolve(response); },
        error: (error) => { reject(error); },
        complete: () => { console.log('Calendrier mis à jour'); }
      });
    });
  }

  // méthode de téléchargement de la relance
  downloadCalendar(idGroupe: string): Promise<any> {
    const url = `${this.apiUrl}download-calendar/${idGroupe}`;

    return new Promise<any>((resolve, reject) => {
      this.http.get(url, { responseType: 'blob', headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('Calendrier téléchargé') }
      });
    });
  }

  getAllByEcoleID(idEcole) {
    let registreUrl = this.apiUrl + "getAllByEcoleID/" + idEcole;
    return this.http.get<Classe[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
