import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Mission } from 'src/app/models/Mission';

@Injectable({
  providedIn: 'root'
})
export class MissionService {

  apiUrl = `${environment.origin}/mission`;

  constructor(private httpClient: HttpClient) { }

  //Methode d'ajout d'une mission
  postMission(mission: Mission)
  {
    
  }
}
