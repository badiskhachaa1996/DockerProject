import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Matiere } from '../models/Matiere';

const httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };


@Injectable({
  providedIn: 'root'
})
export class MatiereService {

  apiUrl = environment.origin + "matiere/"

  constructor(private httpClient: HttpClient) { }

  //Creation d'une nouvelle matière
  create(matiere: Matiere)
  {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Matiere>(registreUrl, matiere, httpOptions1);
  }

  //Recuperation de la liste des matieres
  getAll()
  {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Matiere[]>(registreUrl, httpOptions1);
  }

  //Methode de recuperation d'une matière bia son id
  getById(id: string)
  {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Matiere>(registreUrl, httpOptions1);
  }

  updateById(matiere: Matiere)
  {
    let registreUrl = this.apiUrl + "updateById";
    return this.httpClient.post<Matiere>(registreUrl, matiere, httpOptions1);
  }

  getMatiereList()
  {
    let registreUrl = this.apiUrl + "getMatiereList";
    return this.httpClient.get<any>(registreUrl, httpOptions1);
  }

  getDicMatiere()
  {
    let registreUrl = this.apiUrl + "getDicMatiere";
    return this.httpClient.get<any>(registreUrl, httpOptions1);
  }

  getVolume(){
    let registreUrl = this.apiUrl + "getAllVolume";
    return this.httpClient.get<any>(registreUrl, httpOptions1);
  }
}
