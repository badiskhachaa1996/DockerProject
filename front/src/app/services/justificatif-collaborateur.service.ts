import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AbscenceCollaborateur } from '../models/AbscenceCollaborateur';

@Injectable({
  providedIn: 'root'
})
export class JustificatifCollaborateurService {

  apiUrl = `${environment.origin}abscenceCollaborateur`;

  constructor(private httpClient: HttpClient) { }

  //Methode d'ajout d'une nouvelle abscence
  postAbscence(abscence: AbscenceCollaborateur)
  {
    const url = `${this.apiUrl}/post-absence`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<AbscenceCollaborateur>(url, abscence, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error); })
      );
    });
  }

  //Methode d'envoi d'un justificatif d'abscence
  postJustificatif(formData: FormData)
  {
    const url = `${this.apiUrl}/upload-justificatif-file`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<any>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error); })
      );
    });
  }

  //Methode de modification d'une abscence
  putAbscence(abscence: AbscenceCollaborateur)
  {
    const url = `${this.apiUrl}/put-abscence`;

    return new Promise((resolve, reject) => {
      this.httpClient.put<AbscenceCollaborateur>(url, abscence, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error); })
      );
    });
  }

  //Recuperation de la liste de toutes les abscence en populate sur le s=user_id
  getAllPopulate()
  {
    const url = `${this.apiUrl}/get-all-populate`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<AbscenceCollaborateur[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error); })
      );
    });
  }

  //Recuperation de la liste des abscence d'un utilisateur en populate sur son user id
  getAllByUserIdPopulate(id: string)
  {
    const url = `${this.apiUrl}/get-all-by-user-id-populate/${id}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<AbscenceCollaborateur[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error); })
      );
    });
  }

  //Recuperation d'une abscence via l'id de l'abscence en populate sur son user id
  getByIdPopulate(id: string)
  {
    const url = `${this.apiUrl}/get-by-id-populate/${id}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<AbscenceCollaborateur>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error); })
      );
    });
  }


  //Methode de téléchargement de fichier
  downloadFile(id: string, fileName: string)
  {
    const url = `${this.apiUrl}/download-file/${id}/${fileName}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error); })
      );
    });
  }


  //Methode de mise en forme des dates
  onReplaceDate(date1: Date)
  {
    let parseDate = date1.toLocaleDateString();

    //Mise en place des dates de debut et de fin
    let newDate = '';

    for(let i = 0; i < parseDate.length; i++)
    {
      if(parseDate[i] == '/')
      {
        newDate += '-';
      } else {
        newDate += parseDate[i];
      }
    }

    return (newDate);
  }
}
