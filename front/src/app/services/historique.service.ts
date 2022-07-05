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
    return this.httpClient.post<Historique>(registreUrl, histo, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getByID(id:string){
    let url = this.apiUrl + "getById/"+id;
    return this.httpClient.get<Historique>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  endHistorique(user_id:string){
    let url = this.apiUrl+"endHistorique"
    let data = {user_id,date_fin:new Date()}
    return this.httpClient.post<Historique>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAll(){
    let url = this.apiUrl + "getAll";
    return this.httpClient.get<Historique>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
