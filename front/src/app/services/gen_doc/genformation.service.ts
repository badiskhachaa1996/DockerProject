import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenFormation } from 'src/app/models/gen_doc/GenFormation';
import { GenRentre } from 'src/app/models/gen_doc/GenRentre';
@Injectable({
  providedIn: 'root'
})
export class GenFormationService {

  apiUrl = `${environment.origin}genFormation`;

  constructor(private httpClient: HttpClient) { }

  // methode d'ajout d'une école
  addFormation(genFormation: GenFormation) {
    const url = `${this.apiUrl}/add-formation`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<GenFormation>(url, genFormation, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Ecole ajouté'),
      })
    });
  }

  // methode de modification de l'école
  updateFormation(genFormation: GenFormation) {
    const url = `${this.apiUrl}/update-formation`;

    return new Promise((resolve, reject) => {
      this.httpClient.put<GenFormation>(url, genFormation, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Ecole modifié'),
      })
    });
  }

    // methode de modification de l'école
    deleteFormation(genFormation: GenFormation) {
        const url = `${this.apiUrl}/delete-formation`;
    
        return new Promise((resolve, reject) => {
          this.httpClient.put<GenFormation>(url, genFormation, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
            next: (response) => resolve(response),
            error: (error) => reject(error),
            complete: () => console.log('Ecole supprimé'),
        })
    });
    }

  // methode de recupération des écoles
  getFormations() {
    const url = `${this.apiUrl}/get-formations`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<GenFormation[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error)
      })
    });
  }

    // methode de recupération d'une formation par ID
    getById(id: string) {
      const url = `${this.apiUrl}/get-formation/${id}`;
      return new Promise((resolve, reject) => {
        this.httpClient.get<GenFormation>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
          next: (response) => resolve(response),
          error: (error) => reject(error)
        })
      });
    }



}
