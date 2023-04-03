import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Stage } from '../models/Stage';

@Injectable({
  providedIn: 'root'
})
export class StageService {

  apiUrl: string = `${environment.origin}stage`;

  constructor(private httpClient: HttpClient) { }

  // recuperation de la liste des stages
  getStages(): Promise<Stage[]> 
  {
    const url = `${this.apiUrl}/get-stages`;

    return new Promise<Stage[]>((resolve, reject) => {
      this.httpClient.get<Stage[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: Stage[]) => {resolve(response)},
        error: (error: any) => {reject(error)},
        complete: () => {console.log('Recuperation des stage réussie')}
      });
    });
  }

  // recuperation du stage via son id
  getStage(id: string): Promise<Stage> 
  {
    const url = `${this.apiUrl}/get-stage/${id}`;

    return new Promise<Stage>((resolve, reject) => {
      this.httpClient.get<Stage>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: Stage) => {resolve(response)},
        error: (error: any) => {reject(error)},
        complete: () => {console.log('Recuperation du stage réussie')}
      });
    });
  }

  // recuperation des stages d'un utilisateur via son id étudiant
  getStageByStudentId(id: string): Promise<Stage[]> 
  {
    const url = `${this.apiUrl}/get-stage-by-student-id/${id}`;

    return new Promise<Stage[]>((resolve, reject) => {
      this.httpClient.get<Stage[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: Stage[]) => {resolve(response)},
        error: (error: any) => {reject(error)},
        complete: () => {console.log("Recuperation des stages de l'étudiant réussie")}
      });
    });
  }

  // recuperation des stages d'une entreprise via son id
  getStageByEnterpriseId(id: string): Promise<Stage[]> 
  {
    const url = `${this.apiUrl}/get-stage-by-enterprise-id/${id}`;

    return new Promise<Stage[]>((resolve, reject) => {
      this.httpClient.get<Stage[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: Stage[]) => {resolve(response)},
        error: (error: any) => {reject(error)},
        complete: () => {console.log("Recuperation des stages de l'entreprise réussie")}
      });
    });
  }

  // création d'un nouveau stage
  postStage(stage: Stage): Promise<any> 
  {
    const url = `${this.apiUrl}/post-stage`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post<Stage>(url, stage, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => {resolve(response)},
        error: (error: any) => {reject(error)},
        complete: () => {console.log("Création du stage réussie")}
      });
    });
  }

  // modification d'un stage
  putStage(stage: Stage): Promise<any> 
  {
    const url = `${this.apiUrl}/put-stage`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.put<Stage>(url, stage, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => {resolve(response)},
        error: (error: any) => {reject(error)},
        complete: () => {console.log("Modification du stage réussie")}
      });
    });
  }

  // modification du status d'un stage
  patchStageStatus(idStage: string, commercialEmail: string, status: string): Promise<any>
  {
    const url = `${this.apiUrl}/patch-stage-status`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.patch<any>(url, {idStage: idStage, commercialEmail: commercialEmail, status: status}, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => {resolve(response)},
        error: (error: any) => {reject(error)},
        complete: () => {console.log("Modification du status du stage réussie")}
      });
    });
  }
}
