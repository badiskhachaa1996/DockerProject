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
    const url = `${this.apiUrl}/post-conge`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<Conge>(url, conge, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response); },
        error: (error) => { reject(error); }
      });
    });
  }


  // mise à jour du statut de la demande
  patchStatut(answer: string, id: string) {
    const url = `${this.apiUrl}/answer`;

    return new Promise((resolve, reject) => {
      this.httpClient.patch<any>(url, {answer: answer, id: id}, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response); },
        error: (error) => { reject(error); }
      });
    });
  }


  // recuperation des demandes d'un utilisateur
  getAllByUserId(user_id: string) {
    const url = `${this.apiUrl}/get-conges-user-id/${user_id}`;

    return new Promise<Conge[]>((resolve, reject) => {
      this.httpClient.get<Conge[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error) })
      );
    });
  }


  // mise à jour d'un objet conge
  putConge(conge: Conge): Promise<any>
  {
    const url = `${this.apiUrl}/put-conge`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.put(url, conge, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response); },
        error: (error) => { reject(error); }
      });
    });
  }


  // suppression d'une demande de conge
  deleteConge(id: string): Promise<any>
  {
    const url = `${this.apiUrl}/delete-conge/${id}`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.delete(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response); },
        error: (error) => { reject(error); }
      });
    });
  }

  // upload du justificatif
  uploadJustificatif(formData: FormData): Promise<any>
  {
    const url = `${this.apiUrl}/upload-justificatif`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post<any>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response); },
        error: (err) => { reject(err); },
      });
    });
  }

  // download du justificatif
  donwloadJustificatif(id: string): Promise<any>
  {
    const url = `${this.apiUrl}/download-justificatif/${id}`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(url, { responseType: 'blob', headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
      });
    });
  }

}
