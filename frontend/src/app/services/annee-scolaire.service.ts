import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
  
import { AnneeScolaire } from '../models/AnneeScolaire';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json','Access-Control-Allow-Origin':'*'}​​​​​​​​)}​​​​​​​​;
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

  getByID(AnneeScolaire: any){
    let anneeScolaireUrl=this.apiUrl+"archivee"+AnneeScolaire._id;
    return this.http.post<any>(anneeScolaireUrl,AnneeScolaire,httpOptions1);
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
