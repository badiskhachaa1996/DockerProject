import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ForfeitForm } from '../models/forfeitForm';

@Injectable({
  providedIn: 'root'
})
export class ForfeitFormService {

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) };

  apiUrl = environment.origin + "forfeitForm/"
  constructor(private httpClient: HttpClient) { }

  //Methode de recuperation de la liste des formateurs
  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<ForfeitForm[]>(registreUrl, this.httpOptions);
  }

  //Methode de recuperation d'un formateur via son id formateur
  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<ForfeitForm>(registreUrl, this.httpOptions);
  }

  updateById(forfeitForm:ForfeitForm) {
    let registreUrl = this.apiUrl + "updateById";
    return this.httpClient.post<ForfeitForm>(registreUrl,forfeitForm, this.httpOptions);
  }

  create(forfeitForm:ForfeitForm) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<ForfeitForm>(registreUrl,forfeitForm, this.httpOptions);
  }

  delete(id:string){
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.httpClient.get<ForfeitForm>(registreUrl, this.httpOptions);
  }
}
