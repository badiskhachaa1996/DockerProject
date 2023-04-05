import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FactureCommission } from '../models/FactureCommission';

@Injectable({
  providedIn: 'root'
})
export class FactureCommissionService {
  apiUrl = environment.origin + "factureCommission/"
  constructor(private httpClient: HttpClient) { }

  create(data: FactureCommission) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<any>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
