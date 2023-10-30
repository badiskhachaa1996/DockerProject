import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Annonce } from 'src/app/models/Annonce';
import jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AnnonceService {

  apiUrl = `${environment.origin}annonce/`;

  constructor(private httpClient: HttpClient) { }

  //Methode d'ajout d'une annonce
  postAnnonce(annonce: Annonce) {
    const url = `${this.apiUrl}post-annonce`;
    //Création des Tickets automatiques
    if (localStorage.getItem('token')) {
      let token = jwt_decode(localStorage.getItem('token'))
    } else {
      if (annonce.entreprise_name) {

      }
    }
    return new Promise((resolve, reject) => {
      this.httpClient.post<Annonce>(url, annonce, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) }).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  //Methode de recuperation de la liste des annonces
  getAnnonces() {
    const url = `${this.apiUrl}get-annonces`;

    return new Promise<Annonce[]>((resolve, reject) => {
      this.httpClient.get<Annonce[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) }).subscribe(
        (response) => { resolve(response); },
        (error) => { console.error(error); reject(error); }
      );
    });
  }

  //Methode de recuperation de la liste des annonces
  getAnnoncesByEntrepriseID(entreprise_id) {
    const url = `${this.apiUrl}get-annonces-by-entreprise-id/` + entreprise_id;

    return new Promise<Annonce[]>((resolve, reject) => {
      this.httpClient.get<Annonce[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => { resolve(response); },
        (error) => { console.error(error); reject(error); }
      );
    });
  }

  //Recuperation d'une annonce via son identifiant
  getAnnonce(annonceId: string) {
    const url = `${this.apiUrl}get-annonce/${annonceId}`;

    return new Promise<Annonce>((resolve, reject) => {
      this.httpClient.get<Annonce>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => { resolve(response); },
        (error) => { reject(error); }
      );
    });
  }

  //Recuperation des annonces via le user Id
  getAnnoncesByUserId(userId: string) {
    const url = `${this.apiUrl}get-annonces-by-user-id/${userId}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<Annonce[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => { resolve(response); },
        (error) => { reject(error); }
      );
    });
  }

  //Methode de modification d'une annonce
  putAnnonce(annonce: Annonce) {
    const url = `${this.apiUrl}put-annonce`;

    return new Promise((resolve, reject) => {
      this.httpClient.put<Annonce>(url, annonce, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => { resolve(response); },
        (error) => { reject(error); }
      );
    });
  }

  delete(id) {
    const url = `${this.apiUrl}delete/${id}`;

    return new Promise((resolve, reject) => {
      this.httpClient.delete<Annonce>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => { resolve(response); },
        (error) => { reject(error); }
      );
    });
  }
}
