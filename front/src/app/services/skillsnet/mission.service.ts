import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Mission } from '../../models/Mission';

@Injectable({
  providedIn: 'root'
})
export class MissionService {

  apiUrl = `${environment.origin}/mission/`;

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
        (error) => { reject(error); }
      );
    });
  }

}
