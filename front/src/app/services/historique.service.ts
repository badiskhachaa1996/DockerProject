import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Historique } from '../models/Historique';



@Injectable({
  providedIn: 'root'
})
export class HistoriqueService {

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  apiUrl = environment.origin + "historique/"

  constructor(private httpClient: HttpClient) { }

  //Creation d'une nouvelle matière
  create(histo: Historique)
  {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Historique>(registreUrl, histo, this.httpOptions1);
  }

  getByID(id:string){
    let url = this.apiUrl + "getById/"+id;
    return this.httpClient.get<Historique>(url, this.httpOptions1);
  }

  endHistorique(user_id:string){
    let url = this.apiUrl+"endHistorique"
    let data = {user_id,date_fin:new Date()}
    return this.httpClient.post<Historique>(url, data, this.httpOptions1);
  }

  getAll(){
    let url = this.apiUrl + "getAll";
    return this.httpClient.get<Historique>(url, this.httpOptions1);
  }
}
