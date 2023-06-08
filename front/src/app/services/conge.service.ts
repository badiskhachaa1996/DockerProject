import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Conge } from '../models/Conge';

@Injectable({
  providedIn: 'root'
})
export class CongeService {

  apiUrl = `${environment.origin}conge`;

  constructor(private httpClient: HttpClient) { }


  //Méthode de demande de congés
  postConge(conge: Conge) {
    const url = `${this.apiUrl}/new-holidays`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<Conge>(url, conge, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response); },
        error: (error) => { reject(error); }
      });
    });
  }


  //Méthode de modification de congés
  patchConge(conge: Conge) {
    const url = `${this.apiUrl}/patch-holidays`;

    return new Promise((resolve, reject) => {
      this.httpClient.patch<Conge>(url, conge, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response); },
        error: (error) => { reject(error); }
      });
    });
  }


  //Methode de réfus de congés
  patchRefuseHolidays(conge_id: string) {
    const url = `${this.apiUrl}/refuse-holidays`;

    return new Promise((resolve, reject) => {
      this.httpClient.patch(url, conge_id, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error); })
      );
    });
  }


  //Methode de recuperation des demandes d'un utilisateur entre 2 dates
  getByUserIdBetweenPopulate(user_id: string) {
    const url = `${this.apiUrl}/get-by-user-id/${user_id}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error) })
      );
    });
  }


  //Methode de recuperation des demandes 
  getAllPopulate() {
    const url = `${this.apiUrl}/get-all-populate`;

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error) })
      );
    });
  }


  //Methode de recuperation des demandes entre 2 dates pour un service
  getAllBetweenPopulateForService(user_id: string) {
    const url = `${this.apiUrl}/get-all-between-populate-for-service/${user_id}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error) })
      );
    });
  }

}
