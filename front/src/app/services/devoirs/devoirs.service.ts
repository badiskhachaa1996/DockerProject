import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Devoir } from 'src/app/models/devoir';

@Injectable({
  providedIn: 'root'
})
export class DevoirsService {
  apiUrl = environment.origin + "devoir/";
  constructor(private http: HttpClient) { }
  getAll() {
    let anneeScolaireUrl = this.apiUrl + "getAll";
    return this.http.get<any>(anneeScolaireUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllByFormateurID(id) {
    let anneeScolaireUrl = this.apiUrl + "getAllByFormateurID/" + id;
    return this.http.get<any>(anneeScolaireUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  create(devoir: Devoir) {
    let anneeScolaireUrl = this.apiUrl + "create";
    return this.http.post<any>(anneeScolaireUrl, devoir, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  uploadFile(){
    
  }
}
