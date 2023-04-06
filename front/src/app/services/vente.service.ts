import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FactureCommission } from '../models/FactureCommission';
import { Vente } from '../models/Vente';

@Injectable({
  providedIn: 'root'
})
export class VenteService {

  apiUrl = environment.origin + "vente/"
  constructor(private httpClient: HttpClient) { }

  create(data: Vente) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Vente>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  update(data: Vente) {
    let registreUrl = this.apiUrl + "update";
    return this.httpClient.put<Vente>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Vente[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByPartenaireID(partenaire_id) {
    let registreUrl = this.apiUrl + "getAll/" + partenaire_id;
    return this.httpClient.get<Vente[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
