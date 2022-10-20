import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Mission } from '../../models/Mission';

@Injectable({
  providedIn: 'root'
})
export class MissionService {

  apiUrl = `${environment.origin}mission/`;

  constructor(private httpClient: HttpClient) { }

  //Methode d'ajout d'une mission
  postMission(mission: Mission)
  {
    const url = `${this.apiUrl}post-mission`;
    
    return new Promise((resolve, reject) => {
      this.httpClient.post<Mission>(url, mission, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }


  //Methode de recuperation de la liste des missions
  getMissions()
  {
    const url = `${this.apiUrl}get-missions`;
    
    return new Promise((resolve, reject) => {
      this.httpClient.get<Mission[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => { resolve(response); },
        (error) => { console.log(error); reject(error); }
      );
    });
  }

  //Recuperation d'une mission via son identifiant
  getMission(missionId: string)
  {
    const url = `${this.apiUrl}get-mission/${missionId}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<Mission>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => { resolve(response); },
        (error) => { reject(error); }
      );
    });
  }

  //Recuperation d'une mission via l'identifiant d'un utilisateur
  getMissionsByUserId(user_id: string)
  {
    const url = `${this.apiUrl}get-missions-by-user-id/${user_id}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<Mission[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => { resolve(response); },
        (error) => { reject(error); }
      );
    });
  }

  //Recuperation d'une mission via l'identifiant d'un utilisateur
  getMissionsByEntrepriseId(entreprise_id: string)
  {
    const url = `${this.apiUrl}get-missions-by-entreprise-id/${entreprise_id}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<Mission[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => { resolve(response); },
        (error) => { reject(error); }
      );
    });
  }

  //Methode de modification d'une mission
  putMission(mission: Mission)
  {
    const url = `${this.apiUrl}put-mission`;

    return new Promise((resolve, reject) => {
      this.httpClient.put<Mission>(url, mission, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => { resolve(response); },
        (error) => { reject(error); }
      );
    });
  }

}
