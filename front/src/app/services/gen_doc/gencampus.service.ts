import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenCampus } from 'src/app/models/gen_doc/GenCampus';
@Injectable({
  providedIn: 'root'
})
export class GenCampusService {

  apiUrl = `${environment.origin}genCampus`;

  constructor(private httpClient: HttpClient) { }

  // methode d'ajout d'une école
  addCampus(genCampus: GenCampus) {
    const url = `${this.apiUrl}/add-campus`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<GenCampus>(url, genCampus, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Ecole ajouté'),
      })
    });
  }

  // methode de modification de l'école
  updateCampus(genCampus: GenCampus) {
    const url = `${this.apiUrl}/update-campus`;

    return new Promise((resolve, reject) => {
      this.httpClient.put<GenCampus>(url, genCampus, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Ecole modifié'),
      })
    });
  }

    // methode de modification de l'école
    deleteCampus(genCampus: GenCampus) {
        const url = `${this.apiUrl}/delete-campus`;
    
        return new Promise((resolve, reject) => {
          this.httpClient.put<GenCampus>(url, genCampus, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
            next: (response) => resolve(response),
            error: (error) => reject(error),
            complete: () => console.log('Ecole supprimé'),
        })
    });
    }

  // methode de recupération des écoles
  getCampuss() {
    const url = `${this.apiUrl}/get-campuss`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<GenCampus[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error)
      })
    });
  }

    // methode de recupération d'une école par ID
    getById(id: string) {
      const url = `${this.apiUrl}/get-campus/${id}`;
      return new Promise((resolve, reject) => {
        this.httpClient.get<GenCampus>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
          next: (response) => resolve(response),
          error: (error) => reject(error)
        })
      });
    }

}
