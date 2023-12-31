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
  //N'est plus utilisé
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

  getNBAll() {
    let registreUrl = this.apiUrl + "getNBAll";
    return this.httpClient.get<{ nb: number }>(registreUrl);
  }

  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Partenaire>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }


  //Modification d'un partenaire
  updatePartenaire(partenaire: Partenaire) {
    let registreUrl = this.apiUrl + "updatePartenaire";
    return this.httpClient.put<any>(registreUrl, partenaire, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  newUpdate(partenaire: any) {
    let registreUrl = this.apiUrl + "newUpdate";
    return this.httpClient.put<any>(registreUrl, partenaire, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  delete(id: string) {
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  getByNameOrEmail(name: string, email: string) {
    let registreUrl = this.apiUrl + "getByNameOrEmail";
    return this.httpClient.post<Partenaire>(registreUrl, { name, email }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getByCode(cc: string) {
    let registreUrl = this.apiUrl + "verificationCode/" + cc;
    return this.httpClient.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  uploadEtatContrat(data: any) {
    let url = this.apiUrl + "file";
    return this.httpClient.post<any>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  downloadContrat(_id: string) {
    const url = `${this.apiUrl}download-contrat/${_id}`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(url, { responseType: 'blob', headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('Contrat téléchargé') }
      });
    });
  }
}
