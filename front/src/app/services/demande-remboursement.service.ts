import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment'; 
import { Demande } from '../models/Demande';

@Injectable({
  providedIn: 'root'
})
export class DemandeRemboursementService {
  apiUrl = environment.origin + "demanderemboursement/"
  constructor(private http: HttpClient) { }

  addRemboursement(demande: Demande): Observable<any> {
    const registerUrl = this.apiUrl + 'newremb';
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    });

    return this.http.post(registerUrl, demande, { headers });
  }
  downloadDoc(id, file) {

    const url = `${this.apiUrl}download-docs/${id}`;

 

    return new Promise<any>((resolve, reject) => {

      const  headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"  }) 
      this.http.get<any>(url, {headers}).subscribe({

        next: (response) => resolve(response),

        error: (error) => reject(error),

       
      })

    });

 

  }

  updateRemboursement(demande: Demande): Observable<any> {
    const registerUrl = this.apiUrl + demande._id ;
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      'token': localStorage.getItem('token')
    });
    return this.http.put(registerUrl, demande, { headers });
  }

    // methode de recupération 
    getAll() {
      const url = `${this.apiUrl}/getAll`;

      return new Promise((resolve, reject) => {
        this.http.get<Demande[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
          next: (response) => resolve(response),
          error: (error) => reject(error)
        })
      });
    }
    deleteDemande(demandeId: string): Observable<any> {
      const deleteUrl = `${this.apiUrl}/${demandeId}`;
      const headers = new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'token': localStorage.getItem('token')
      });
    
      return this.http.delete(deleteUrl, { headers });
    }

    findDemande(docNumber: string ): Observable<any> {
      const getLink = `${this.apiUrl}'/findDemande/'${docNumber}`;
      const headers = new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'token': localStorage.getItem('token')
      });
    
      return this.http.get(getLink, { headers });
    }
    postDoc(formData: FormData) {
      const url = `${this.apiUrl}/upload-docs`;
  
      return new Promise((resolve, reject) => {
        this.http.post<any>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) }).subscribe({
          next: (response) => resolve(response),
          error: (error) => reject(error),
          complete: () => console.log('Fichier ajouté'),
        })
      });
    }
    deleteDoc(id: string, fileName: string): Observable<any> {
      const url = `${this.apiUrl}/delete-doc/${id}/${fileName}`;
      const headers = new HttpHeaders({
        'token': localStorage.getItem('token')
      });
      return this.http.delete(url, { headers });
    }
    
    
}
