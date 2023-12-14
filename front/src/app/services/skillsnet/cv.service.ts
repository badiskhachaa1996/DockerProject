import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CV } from 'src/app/models/CV';

@Injectable({

  providedIn: 'root'

})

export class CvService {



  apiUrl = `${environment.origin}cv`;



  constructor(private httpClient: HttpClient) { }



  // methode d'ajout de cv

  postCv(cv: CV) {

    const url = `${this.apiUrl}/post-cv`;



    return new Promise<CV>((resolve, reject) => {

      this.httpClient.post<CV>(url, cv, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) }).subscribe({

        next: (response) => resolve(response),

        error: (error) => reject(error),

        complete: () => console.log('CV ajouté'),

      })

    });

  }



  //Methode d'envoi du fichier brute

  postCVBrute(formData: FormData) {

    const url = `${this.apiUrl}/upload-cv`;



    return new Promise((resolve, reject) => {

      this.httpClient.post<any>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) }).subscribe({

        next: (response) => resolve(response),

        error: (error) => reject(error),

        complete: () => console.log('Fichier ajouté'),

      })

    });

  }



  // methode de modification de cv

  putCv(cv: CV) {

    const url = `${this.apiUrl}/put-cv`;



    return new Promise((resolve, reject) => {

      this.httpClient.put<CV>(url, cv, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({

        next: (response) => resolve(response),

        error: (error) => reject(error),

        complete: () => console.log('CV modifié'),

      })

    });

  }



  // methode de recupération des cvs

  getCvs() {

    const url = `${this.apiUrl}/get-cvs`;



    return new Promise<CV[]>((resolve, reject) => {

      this.httpClient.get<CV[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({

        next: (response) => resolve(response),

        error: (error) => reject(error),

        complete: () => console.log('CVs récupérés'),

      })

    });

  }



  getCvsPublic() {

    const url = `${this.apiUrl}/get-cvs-public`;



    return new Promise((resolve, reject) => {

      this.httpClient.get<CV[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) }).subscribe({

        next: (response) => resolve(response),

        error: (error) => reject(error),

        complete: () => console.log('CVs récupérés'),

      })

    });

  }



  // methode de recupération d'un cv via son id

  getCv(id: string) {

    const url = `${this.apiUrl}/get-cv/${id}`;



    return new Promise((resolve, reject) => {

      this.httpClient.get<CV>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({

        next: (response) => resolve(response),

        error: (error) => reject(error),

        complete: () => console.log('CV modifié'),

      })

    });



  }







  getByID(id: any) {

    let cvUrl = this.apiUrl + "/get-object-cv/" + id;

    return this.httpClient.get<any>(cvUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });

  }



  // methode de recupération d'un cv via son user id

  getCvbyUserId(id: string) {

    const url = `${this.apiUrl}/get-cv-by-user_id/${id}`;

    return this.httpClient.get<CV>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });



    /*return new Promise<CV>((resolve, reject) => {

      this.httpClient.get<CV>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({

        next: (response) => resolve(response),

        error: (error) => reject(error),

        complete: () => console.log('CV modifié'),

      })

    });*/

  }



  // verification si l'utilisateur possede un cv

  cvExists(id: string, cvLists: CV[]): boolean {

    let result = false;



    for (let user_id in cvLists) {

      if (user_id == id) {

        result = true;

      }

      else {

        result = false;

      }

    }

    return result;

  }



  uploadPicture(formData: FormData) {

    let url = this.apiUrl + "/uploadPicture"

    return this.httpClient.post<any>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }



  getAllPicture() {

    let url = this.apiUrl + "/getAllPicture"

    return this.httpClient.get<{ files: {}, ids: string[] }>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });

  }



  getPictureByUser(id) {

    let url = `${this.apiUrl}/get-picture-by-user/${id}`;

    return this.httpClient.get<{ file: {} }>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });

  }



  downloadCV(user_id) {

    const url = `${this.apiUrl}/download-cv/${user_id}`;



    return new Promise<any>((resolve, reject) => {

      this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) }).subscribe({

        next: (response) => resolve(response),

        error: (error) => reject(error),

        complete: () => console.log('CV modifié'),

      })

    });



  }



  deleteCV(id) {

    const url = `${this.apiUrl}/delete-cv/${id}`;



    return new Promise<any>((resolve, reject) => {

      this.httpClient.delete<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({

        next: (response) => resolve(response),

        error: (error) => reject(error),

        complete: () => console.log('CV supprimé'),

      })

    });

  }

  getAllToday() {
    const url = `${this.apiUrl}/getAllToday`;

    return new Promise<CV[]>((resolve, reject) => {
      this.httpClient.get<CV[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => { resolve(response); },
        (error) => { reject(error); }
      );
    });
  }

  getAllByDate(date1, date2) {
    const url = `${this.apiUrl}/getAllByDate/${date1}/${date2}`;

    return new Promise<CV[]>((resolve, reject) => {
      this.httpClient.get<CV[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => { resolve(response); },
        (error) => { reject(error); }
      );
    });
  }
}

