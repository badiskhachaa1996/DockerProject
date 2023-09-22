import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenRentre } from 'src/app/models/gen_doc/GenRentre';
@Injectable({
  providedIn: 'root'
})
export class GenRentreService {

  apiUrl = `${environment.origin}genRentre`;

  constructor(private httpClient: HttpClient) { }

  // methode d'ajout d'une école
  addRentre(genRentre: GenRentre) {
    const url = `${this.apiUrl}/add-rentre`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<GenRentre>(url, genRentre, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Ecole ajouté'),
      })
    });
  }

  // methode de modification de l'école
  updateRentre(genRentre: GenRentre) {
    const url = `${this.apiUrl}/update-rentre`;

    return new Promise((resolve, reject) => {
      this.httpClient.put<GenRentre>(url, genRentre, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Ecole modifié'),
      })
    });
  }

    // methode de modification de l'école
    deleteRentre(genRentre: GenRentre) {
        const url = `${this.apiUrl}/delete-rentre`;
    
        return new Promise((resolve, reject) => {
          this.httpClient.put<GenRentre>(url, genRentre, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
            next: (response) => resolve(response),
            error: (error) => reject(error),
            complete: () => console.log('Ecole supprimé'),
        })
    });
    }

  // methode de recupération des écoles
  getRentres() {
    const url = `${this.apiUrl}/get-rentres`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<GenRentre[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error)
      })
    });
  }

  
    // recuperation de la liste des compétences d'un profile
    getRentreByFormation(id: string) {
      const url = `${this.apiUrl}/get-rentre-by-formation/${id}`;
      
      return new Promise((resolve, reject) => {
        this.httpClient.get<GenRentre[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
          next: (response) => resolve(response),
          error: (error) => reject(error)
        });
      });
    }

        // methode de recupération d'une formation par ID
        getById(id: string) {
          const url = `${this.apiUrl}/get-rentre/${id}`;
          return new Promise((resolve, reject) => {
            this.httpClient.get<GenRentre>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
              next: (response) => resolve(response),
              error: (error) => reject(error)
            })
          });
        }

}
