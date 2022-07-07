import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Partenaire } from '../models/Partenaire';
import { User } from '../models/User';
import { CommercialPartenaire } from '../models/CommercialPartenaire';

@Injectable({
  providedIn: 'root'
})
export class PartenaireService {
  apiUrl = environment.origin + "partenaire/"

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) };

  constructor(private httpClient: HttpClient) { }
  genderMap: any = { 'Monsieur': 'Mr.', 'Madame': 'Mme.', undefined: '', 'other': 'Mel.' };
  create(newPartenaire: Partenaire) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<any>(registreUrl, { newPartenaire }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  inscription(newUser: User, newPartenaire: Partenaire, newCommercial: CommercialPartenaire) {
    let registreUrl = this.apiUrl + "inscription";
    return this.httpClient.post<any>(registreUrl, { newUser, newPartenaire, newCommercial }, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Partenaire[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Partenaire>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}