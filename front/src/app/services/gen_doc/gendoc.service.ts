import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenDoc } from 'src/app/models/gen_doc/GenDoc';
@Injectable({
  providedIn: 'root'
})
export class GenDocService {

  apiUrl = `${environment.origin}genDoc`;

  constructor(private httpClient: HttpClient) { }

  // methode d'ajout d'une école
  addDoc(genDoc: GenDoc) {
    const url = `${this.apiUrl}/add-doc`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<GenDoc>(url, genDoc, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Ecole ajouté'),
      })
    });
  }

  // methode de modification de l'école
  updateDoc(genDoc: GenDoc) {
    const url = `${this.apiUrl}/update-doc`;

    return new Promise((resolve, reject) => {
      this.httpClient.put<GenDoc>(url, genDoc, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Ecole modifié'),
      })
    });
  }

    // methode de modification de l'école
    deleteDoc(genDoc: GenDoc) {
        const url = `${this.apiUrl}/delete-doc`;
    
        return new Promise((resolve, reject) => {
          this.httpClient.put<GenDoc>(url, genDoc, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
            next: (response) => resolve(response),
            error: (error) => reject(error),
            complete: () => console.log('Ecole supprimé'),
        })
    });
    }

  // methode de recupération des écoles
  getDocs() {
    const url = `${this.apiUrl}/get-docs`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<GenDoc[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error)
      })
    });
  }

  getDoc(id: string) {
    const url = `${this.apiUrl}/get-doc/${id}`;
    return this.httpClient.get<GenDoc>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

}
