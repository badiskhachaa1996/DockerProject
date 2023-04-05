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
  patchStatus(idStage: string, commercialEmail: string, status: string): Promise<any>
  {
    const url = `${this.apiUrl}/patch-status`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.patch<any>(url, {idStage: idStage, commercialEmail: commercialEmail, status: status}, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => {resolve(response)},
        error: (error: any) => {reject(error)},
        complete: () => {console.log("Modification du status du stage réussie")}
      });
    });
  }

  // mis à jour des missions d'un stagiaire
  patchMissionTasks(idStage: string, commercialEmail: string, missions: string): Promise<any>
  {
    const url = `${this.apiUrl}/patch-mission-tasks`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.patch<any>(url, {idStage: idStage, commercialEmail: commercialEmail, missions: missions}, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => {resolve(response)},
        error: (error: any) => {reject(error)},
        complete: () => {console.log("Modification de la mission du stage réussie")}
      });
    });
  }

  // upload de la convention de stage
  uploadConvention(formData: FormData): Promise<any>
  {
    const url = `${this.apiUrl}/upload-convention`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => { resolve(response); },
          error: (error) => { reject(error); },
          complete: () => { console.log("Convention de stage envoyé"); }
      });
    });
  }

  // upload de l'avenant de stage
  uploadAvenant(formData: FormData): Promise<any>
  {
    const url = `${this.apiUrl}/upload-avenant`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => { resolve(response); },
          error: (error) => { reject(error); },
          complete: () => { console.log("Avenant de stage envoyé"); }
      });
    });
  }

  // upload de l'avenant de stage
  uploadAttestation(formData: FormData): Promise<any>
  {
    const url = `${this.apiUrl}/upload-attestation`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: any) => { resolve(response); },
          error: (error) => { reject(error); },
          complete: () => { console.log("Attestation de stage envoyé"); }
      });
    });
  }

  // download de la convention de stage
  downloadConvention(idStage: string): Promise<any>
  {
    const url = `${this.apiUrl}download-convention/${idStage}`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(url, { responseType: 'blob', headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log("Convention téléchargé") }
      });
    });
  }

  // download de l'avenant de stage
  downloadAvenant(idStage: string): Promise<any>
  {
    const url = `${this.apiUrl}download-avenant/${idStage}`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(url, { responseType: 'blob', headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log("Avenant téléchargé") }
      });
    });
  }

  // download de l'attestation de stage
  downloadAttestation(idStage: string): Promise<any>
  {
    const url = `${this.apiUrl}download-attestation/${idStage}`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(url, { responseType: 'blob', headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log("Attestation téléchargé") }
      });
    });
  }
}
