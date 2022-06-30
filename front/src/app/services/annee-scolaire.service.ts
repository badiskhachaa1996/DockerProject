import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AnneeScolaire } from '../models/AnneeScolaire';
const httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})
export class AnneeScolaireService {

  
  apiUrl =environment.origin+ "anneeScolaire/"
  constructor(private http : HttpClient, private _router: Router) { }

  getAll(){
    let anneeScolaireUrl=this.apiUrl+"getAll";
    return this.http.get<any>(anneeScolaireUrl,httpOptions1);
  }

  getByID(AnneeScolaireid: any){
    let anneeScolaireUrl=this.apiUrl+"getById/"+AnneeScolaireid;
    return this.http.get<any>(anneeScolaireUrl,httpOptions1);
  }
  
  //Recuperer l'année scolaire en cours
  getActive()
  {
    let anneeScolaireUrl = this.apiUrl + "getActive";
    return this.http.get<AnneeScolaire>(anneeScolaireUrl, httpOptions1)
  }

  
 create(anneeScolaire: any){
    let anneeScolaireUrl=this.apiUrl+"create";
    return this.http.post<any>(anneeScolaireUrl,anneeScolaire,httpOptions1);
  }
  
  edit(AnneeScolaire: any){
    let anneeScolaireUrl=this.apiUrl+"edit"+AnneeScolaire._id;
    return this.http.post<any>(anneeScolaireUrl,AnneeScolaire,httpOptions1);
  }

  archivee(AnneeScolaire: any){
    let anneeScolaireUrl=this.apiUrl+"archivee/"+AnneeScolaire;
    return this.http.get<any>(anneeScolaireUrl,httpOptions1);
  }
  activer(AnneeScolaire: any){
    let anneeScolaireUrl=this.apiUrl+"activer/"+AnneeScolaire;
    return this.http.get<any>(anneeScolaireUrl,httpOptions1);
  }



}
