import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Diplome } from '../models/Diplome';

const httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' })/*.append('token', localStorage.getItem('token'))*/ };


@Injectable({
  providedIn: 'root'
})
export class DiplomeService {

  apiUrl = environment.origin + "diplome/"

  constructor(private httpClient: HttpClient) { }

  //Création d'un nouveau diplôme
  create(diplome: Diplome) 
  {
    let registreUrl = this.apiUrl + "creatediplome";
    return this.httpClient.post<Diplome>(registreUrl, diplome, httpOptions1);
  }

  //Obtenir la liste des diplomes
  getAll() 
  {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Diplome[]>(registreUrl, httpOptions1);
  }

  //Obtenir un diplome par son id diplome
  getById(id: string)
  {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Diplome>(registreUrl, httpOptions1);
  }

  //Obtenir la liste des diplomes par campus
  getAllByCampus(id: string) 
  {
    let registreUrl = this.apiUrl + "getAllByCampus/" + id;
    return this.httpClient.get<Diplome[]>(registreUrl, httpOptions1);
  }

  //Mettre un diplôme à jour
  update(diplome: Diplome)
   {
    let registreUrl = this.apiUrl + "editById/" + diplome._id;
    return this.httpClient.post<Diplome>(registreUrl, diplome, httpOptions1);

  }

  uploadFile(data:FormData){
    let url = this.apiUrl+"file";
    return this.httpClient.post<any>(url,data,httpOptions1)
  }

  getFile(id,name){
    let url = this.apiUrl+"getFile/"+id+"/"+name;
    return this.httpClient.get<any>(url,httpOptions1)
  }

}
