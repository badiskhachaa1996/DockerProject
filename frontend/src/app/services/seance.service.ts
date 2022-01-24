import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Seance } from '../models/Seance';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
const httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };


@Injectable({
  providedIn: 'root'
})
export class SeanceService {

  apiUrl = environment.origin + "seance/"

  constructor(private httpClient: HttpClient) { }

  //Creation d'une nouvelle séance
  create(seance: Seance) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<Seance>(registreUrl, seance, httpOptions1);
  }
  
  getById(id:String){
    let registreUrl = this.apiUrl + "getById/"+id;
    return this.httpClient.get<Seance>(registreUrl, httpOptions1);
  }

  //Recupération de toute les séances 
  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Seance[]>(registreUrl, httpOptions1);
  }

  //mise à jour d'une séance
  update(seance: Seance) {
    let registreUrl = this.apiUrl + "edit/" + seance._id;
    return this.httpClient.post<Seance>(registreUrl, seance, httpOptions1);
  }


  //recuperation de la liste des séances pour le calendrier
  getEvents() {
    let listeSeance: Seance[];
    
    let seanceFromDb = this.getAll();
    seanceFromDb.subscribe(
      (data) => { listeSeance = data; },
      (error) => { console.log(error)}
    );

      return listeSeance;
      
    }    

}
