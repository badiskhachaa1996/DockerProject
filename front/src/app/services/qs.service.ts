import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Presence } from '../models/Presence';

@Injectable({
  providedIn: 'root'
})
export class QSService {
  
  apiUrl = environment.origin + "qs/"

  constructor(private http: HttpClient) { }
  create(data) {
    let url = this.apiUrl + "create";
    return this.http.post<any>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }
}
