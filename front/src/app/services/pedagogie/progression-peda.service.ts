import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProgressionPeda } from 'src/app/models/progressionPeda';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgressionPedaService {
  apiUrl = environment.origin + "progressionPeda/";
  constructor(private httpClient: HttpClient) {
  }
  //Création d'un nouveau rapport de séance
  create(tbObj: ProgressionPeda) {
    let url = this.apiUrl + 'create';
    return this.httpClient.post<ProgressionPeda>(url, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllByUserID(user_id) {
    let url = this.apiUrl + 'getAllByUserID/' + user_id;
    return this.httpClient.get<ProgressionPeda[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }
}
