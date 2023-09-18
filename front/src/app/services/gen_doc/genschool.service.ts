import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenSchool } from 'src/app/models/gen_doc/GenSchool';
@Injectable({
  providedIn: 'root'
})
export class GenSchoolService {

  apiUrl = `${environment.origin}genSchool`;

  constructor(private httpClient: HttpClient) { }

  // methode d'ajout d'une école
  addSchool(genSchool: GenSchool) {
    const url = `${this.apiUrl}/add-school`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<GenSchool>(url, genSchool, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Ecole ajouté'),
      })
    });
  }

  // methode de modification de l'école
  updateSchool(genSchool: GenSchool) {
    const url = `${this.apiUrl}/update-school`;

    return new Promise((resolve, reject) => {
      this.httpClient.put<GenSchool>(url, genSchool, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Ecole modifié'),
      })
    });
  }

    // methode de modification de l'école
    deleteSchool(genSchool: GenSchool) {
        const url = `${this.apiUrl}/delete-school`;
    
        return new Promise((resolve, reject) => {
          this.httpClient.put<GenSchool>(url, genSchool, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
            next: (response) => resolve(response),
            error: (error) => reject(error),
            complete: () => console.log('Ecole supprimé'),
        })
    });
    }


  // methode de recupération d'une école par ID
    getById(id: string) {
      const url = `${this.apiUrl}/get-school/${id}`;
      return new Promise((resolve, reject) => {
        this.httpClient.get<GenSchool>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
          next: (response) => resolve(response),
          error: (error) => reject(error)
        })
      });
    }

  // methode de recupération des écoles
  getSchools() {
    const url = `${this.apiUrl}/get-schools`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<GenSchool[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error)
      })
    });
  }

}
