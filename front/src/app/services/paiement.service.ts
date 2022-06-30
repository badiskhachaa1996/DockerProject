import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Paiement } from '../models/Paiement';


const httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  apiUrl =environment.origin+"paiements/"
  constructor(private http: HttpClient) { }

create(data: Paiement){
  let url = this.apiUrl + "create";
  return this.http.post<any>(url, data, httpOptions1);
}
  
}
