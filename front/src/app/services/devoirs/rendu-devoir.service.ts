import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RenduDevoir } from 'src/app/models/RenduDevoir';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RenduDevoirService {
  apiUrl = environment.origin + "renduDevoir/";
  constructor(private http: HttpClient) { }
  create(devoir: RenduDevoir) {
    let anneeScolaireUrl = this.apiUrl + "create";
    return this.http.post<any>(anneeScolaireUrl, devoir, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  valided(id) {
    let anneeScolaireUrl = this.apiUrl + "valided/" + id;
    return this.http.get<any>(anneeScolaireUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }
}
