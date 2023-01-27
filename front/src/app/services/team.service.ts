import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';
import { Team } from '../models/Team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  apiUrl = `${environment.origin}team`;

  constructor(private httpClient: HttpClient) { }

  //Création d'une équipe
  createTeam(team: Team): Promise<any> 
  {
    const url = `${this.apiUrl}/createTeam`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post<Team>(url, team, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Équipe crée')
      });
    });
  }


  //Modification d'une équipe
  updateTeam(team: Team): Promise<any> 
  {
    const url = `${this.apiUrl}/updateTeam`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.put<Team>(url, team, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Équipe modifié')
      });
    });
  }

  //Récupération de la liste des équipes
  getTeams(): Promise<Team[]>
  {
    const url = `${this.apiUrl}/get-team`;

    return new Promise<Team[]>((resolve, reject) => {
      this.httpClient.get<Team[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Équipes récuperés')
      });
    });
  }


  //Récupération d'une équipe via son id
  getTeam(id: string): Promise<Team>
  {
    const url = `${this.apiUrl}/get-team/${id}`;

    return new Promise<Team>((resolve, reject) => {
      this.httpClient.get<Team>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Équipe récuperé')
      });
    });
  }

  getTeamByResponsableId(id: string): Promise<Team[]>
  {
    const url = `${this.apiUrl}/get-team-by-id-responsable/${id}`;

    return new Promise<Team[]>((resolve, reject) => {
      this.httpClient.get<Team[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Équipe récuperé')
      });
    });
  }
}  
