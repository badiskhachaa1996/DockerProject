import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Diplome } from '../models/Diplome';


@Injectable({
  providedIn: 'root'
})
export class DiplomeService {

  apiUrl = environment.origin + "diplome/"

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  constructor(private httpClient: HttpClient) { }

  //Création d'un nouveau diplôme
  create(diplome: Diplome) {
    let registreUrl = this.apiUrl + "creatediplome";
    return this.httpClient.post<Diplome>(registreUrl, diplome, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Obtenir la liste des diplomes
  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Diplome[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  //Obtenir un diplome par son id diplome
  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Diplome>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Obtenir la liste des diplomes par campus
  getAllByCampus(id: string) {
    let registreUrl = this.apiUrl + "getAllByCampus/" + id;
    return this.httpClient.get<Diplome[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Mettre un diplôme à jour
  update(diplome: Diplome) {
    let registreUrl = this.apiUrl + "editById/" + diplome._id;
    return this.httpClient.post<Diplome>(registreUrl, diplome, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  uploadFile(data: FormData) {
    let url = this.apiUrl + "file";
    return this.httpClient.post<any>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  getFile(id, name) {
    let url = this.apiUrl + "getFile/" + id + "/" + name;
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  // upload du calendrier de la formation
  uploadCalendar(formData: FormData): Promise<any>
  {
    const url = `${this.apiUrl}upload-calendar`;
    
    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => { resolve(response); },
        error: (error) => { reject(error); },
        complete: () => { console.log('Calendrier mis à jour'); }
      });
    });
  }

}
