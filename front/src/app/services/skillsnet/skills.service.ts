import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Competence } from 'src/app/models/Competence';
import { Profile } from 'src/app/models/Profile';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  apiUrl = environment.origin + 'skills';

  constructor(private httpClient: HttpClient) { }

  /* profile */

  // création d'un nouveau profile
  postProfile(profile: Profile) {
    const url = `${this.apiUrl}/post-profile`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<Profile>(url, profile, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Profile crée')
      });
    });
  }

  // modification d'un profile
  putProfile(profile: Profile) {
    const url = `${this.apiUrl}/put-profile`;

    return new Promise((resolve, reject) => {
      this.httpClient.put<Profile>(url, profile, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Profile modifié')
      });
    });
  }

  // recuperation de tous les profiles
  getProfiles() {
    const url = `${this.apiUrl}/get-profiles`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<Profile[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Profiles récuperés')
      });
    });
  }

  // recuperation d'un profile via un id
  getProfile(id: string) {
    const url = `${this.apiUrl}/get-profile/${id}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<Profile>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Profile récuperé')
      });
    });
  }


  /* Compétence */
  // création d'une nouvelle compétence
  postCompetence(competence: Competence) {
    const url = `${this.apiUrl}/post-competence`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<Competence>(url, competence, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Compétence crée')
      });
    });
  }

  // modification d'une compétence
  putCompetence(competence: Competence) {
    const url = `${this.apiUrl}/put-competence`;

    return new Promise((resolve, reject) => {
      this.httpClient.put<Competence>(url, competence, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Competence modifié')
      });
    });
  }

  // recuperation de la liste des competences
  getCompetences() {
    const url = `${this.apiUrl}/get-competences`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<Competence[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Competences récuperés')
      });
    });
  }

  // recuperation d'une competence via son id
  getCompetence(id: string) {
    const url = `${this.apiUrl}/get-competence/${id}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<Competence>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Competence récuperé')
      });
    });
  }

  delete(id: string) {
    const url = `${this.apiUrl}/delete/${id}`;

    return new Promise((resolve, reject) => {
      this.httpClient.delete<Competence>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Competence récuperé')
      });
    });
  }

  // recuperation de la liste des compétences d'un profile
  getCompetenceByProfil(id: string) {
    const url = `${this.apiUrl}/get-competence-by-profile/${id}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<Competence[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Competences du profil récuperé')
      });
    });
  }

}
