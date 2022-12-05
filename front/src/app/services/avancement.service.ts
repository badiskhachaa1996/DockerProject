import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Avancement } from '../models/Avancement';

@Injectable({
  providedIn: 'root'
})
export class AvancementService {

  apiUrl = `${environment.origin}avancement`;

  constructor(private httpClient: HttpClient) { }

  //Methode de creation d'un avancement
  postAvancement(avancement: Avancement) 
  {
    const url = `${this.apiUrl}/post-avancement`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<Avancement>(url, avancement, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response: Avancement) => { resolve(response)}),
        ((error) => { reject(error); })
      );
    });
  }

  //Methode de recuperation de la liste des avancements
  getAll()
  {
    const url = `${this.apiUrl}/get-all`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<Avancement[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response: Avancement[]) => { resolve(response)}),
        ((error) => { reject(error); })
      );
    });
  }

  //Methode de recuperation d'un avancement via son id
  getById(id: string)
  {
    const url = `${this.apiUrl}/get-by-id/${id}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<Avancement>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response: Avancement) => { resolve(response)}),
        ((error) => { reject(error); })
      );
    });
  }

  //Methode de modification d'un avancement
  patchById(avancement: Avancement)
  {
    const url = `${this.apiUrl}/patch-by-id`;

    return new Promise((resolve, reject) => {
      this.httpClient.patch<Avancement>(url, avancement, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response: Avancement) => { resolve(response)}),
        ((error) => { reject(error); })
      );
    });
  }

}
