import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Paiement } from '../models/Paiement';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };
  apiUrl = environment.origin + "paiements/"
  constructor(private http: HttpClient) { }

  create(data: Paiement) {
    let url = this.apiUrl + "create";
    return this.http.post<any>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

}
