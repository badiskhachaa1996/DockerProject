import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AdmissionFormDubai } from '../models/AdmissionFormDubai';

@Injectable({
  providedIn: 'root'
})
export class FormAdmissionDubaiService {

  endPoint: string = `${environment.origin}admission-dubai`;

  constructor(private httpClient: HttpClient) { }

  // méthode d'ajout
  postDubaiAdmission(admissionFormDubai: AdmissionFormDubai): Promise<AdmissionFormDubai>
  {
    const url = `${this.endPoint}/post-dubai-admission`;

    return new Promise<AdmissionFormDubai>((resolve, reject) => {
      this.httpClient.post<AdmissionFormDubai>(url, admissionFormDubai, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) }).subscribe({
        next: (response) => { resolve(response); },
        error: (error) => { reject(error); },
        complete: () => { console.log("Requête de création exécuté") }
      });
    });
  }

  // récupération de toutes les admissions
  getDubaiAdmissions(): Promise<AdmissionFormDubai[]>
  {
    const url = `${this.endPoint}/get-dubai-admissions`;

    return new Promise<AdmissionFormDubai[]>((resolve, reject) => {
      this.httpClient.get<AdmissionFormDubai[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response); },
        error: (error) => { reject(error); },
        complete: () => { console.log("Requête de création exécuté") }
      });
    });
  }

  // récupération d'une admission via son id'
  getDubaiAdmission(id: string): Promise<AdmissionFormDubai>
  {
    const url = `${this.endPoint}/get-dubai-admission/${id}`;

    return new Promise<AdmissionFormDubai>((resolve, reject) => {
      this.httpClient.get<AdmissionFormDubai>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response); },
        error: (error) => { reject(error); },
        complete: () => { console.log("Requête de création exécuté") }
      });
    });
  }
}
