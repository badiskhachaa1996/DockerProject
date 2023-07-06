import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Collaborateur } from '../models/Collaborateur';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class RhService {

  endPoint: string = `${environment.origin}rh`;

  constructor(private httpClient: HttpClient) { }

  /** partie collaborateur */
  // recuperation de la liste des agents
  getAgents(): Promise<User[]>
  {
    const url = `${this.endPoint}/get-agents`;

    return new Promise<User[]>((resolve, reject) => {
      this.httpClient.get<User[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: User[]) => { resolve(response) },
        error: (error) => { reject(error) }
      });
    });
  }

  // création d'un nouveau collaborateur
  postCollaborateur(collaborateur: Collaborateur): Promise<Collaborateur>
  {
    const url = `${this.endPoint}/post-collaborateur`;

    return new Promise<Collaborateur>((resolve, reject) => {
      this.httpClient.post<Collaborateur>(url, collaborateur, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: Collaborateur) => { resolve(response) },
        error: (error) => { reject(error) }
      });
    });
  }

  // mettre à jour les informations personnelles du collaborateur
  patchCollaborateurPersonalData(user: User): Promise<User>
  {
    const url = `${this.endPoint}/update-agent-personal-data`;

    return new Promise<User>((resolve, reject) => {
      this.httpClient.patch<User>(url, user, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: User) => { resolve(response) },
        error: (error) => { reject(error) }
      });
    });
  }

  // mettre à jour les informations du collaborateur
  patchCollaborateurData(collaborateur: Collaborateur): Promise<Collaborateur>
  {
    const url = `${this.endPoint}/update-agent-data`;

    return new Promise<Collaborateur>((resolve, reject) => {
      this.httpClient.patch<Collaborateur>(url, collaborateur, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: Collaborateur) => { resolve(response) },
        error: (error) => { reject(error) }
      });
    });
  }

  // récupérer la liste des collaborateurs
  getCollaborateurs(): Promise<Collaborateur[]>
  {
    const url = `${this.endPoint}/get-collaborateurs`;

    return new Promise<Collaborateur[]>((resolve, reject) => {
      this.httpClient.get<Collaborateur[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: Collaborateur[]) => { resolve(response) },
        error: (error) => { reject(error) }
      });
    });
  }

    // récupérer un collaborateur via son id
    getCollaborateur(id: string): Promise<Collaborateur>
    {
      const url = `${this.endPoint}/get-collaborateur/${id}`;
  
      return new Promise<Collaborateur>((resolve, reject) => {
        this.httpClient.get<Collaborateur>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
          next: (response: Collaborateur) => { resolve(response) },
          error: (error) => { reject(error) }
        });
      });
    }

    // récupérer un collaborateur via son id user
    getCollaborateurByUserId(id: string): Promise<Collaborateur>
    {
      const url = `${this.endPoint}/get-collaborateur-by-user-id/${id}`;
  
      return new Promise<Collaborateur>((resolve, reject) => {
        this.httpClient.get<Collaborateur>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
          next: (response: Collaborateur) => { resolve(response) },
          error: (error) => { reject(error) }
        });
      });
    }

    // ajout d'un document au collaborateur
    uploadCollaborateurDocument(formData: FormData): Promise<any>
    {
      const url = `${this.endPoint}/upload-collaborateur-document`;

      return new Promise((resolve, reject) => {
        this.httpClient.patch(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
          next: (response: any) => { resolve(response); },
          error: (error) => { reject(error); },
        });
      });
    }

    //*Todo: upload d'un document du collaborateur

    // suppression du collaborateur via son user id
    deleteCollaborateur(id: string): Promise<any>
    {
      const url = `${this.endPoint}/delete-collaborateur/${id}`;

      return new Promise<any>((resolve, reject) => {
        this.httpClient.delete(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
          next: (response: any) => { resolve(response); },
          error: (error) => { reject(error); },
        });
      });
    }

    // ajout de compétence
    patchCollaborateurSkills(id: any, skills: any[]): Promise<Collaborateur>
    {
      const url = `${this.endPoint}/add-collaborateur-skills`;

      return new Promise<Collaborateur>((resolve, reject) => {
        this.httpClient.patch(url, {id: id, skills: skills}, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
          next: (response: Collaborateur) => { resolve(response); },
          error: (error) => { reject(error); },
        });
      });
    }

  /** end partie collaborateur */
}
