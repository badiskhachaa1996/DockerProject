import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
  
import { AnneScolaire } from '../models/AnneeScolaire';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json','Access-Control-Allow-Origin':'*'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})
export class AnneeScolaireService {

  
  apiUrl =environment.origin+ "anneScolaire/"
  constructor(private http : HttpClient, private _router: Router) { }

  getAll(){
    let anneeScolaireUrl=this.apiUrl+"getAll";
    return this.http.get<any>(anneeScolaireUrl,httpOptions1);
  }

  getByID(AnneScolaire: any){
    let anneeScolaireUrl=this.apiUrl+"archivee"+AnneScolaire._id;
    return this.http.post<any>(anneeScolaireUrl,AnneScolaire,httpOptions1);
  }
 create(anneScolaire: any){
    let anneeScolaireUrl=this.apiUrl+"create";
    return this.http.post<any>(anneeScolaireUrl,AnneScolaire,httpOptions1);
  }
  
  edit(AnneScolaire: any){
    let anneeScolaireUrl=this.apiUrl+"edit"+AnneScolaire._id;
    return this.http.post<any>(anneeScolaireUrl,AnneScolaire,httpOptions1);
  }

  archiveee(AnneScolaire: any){
    let anneeScolaireUrl=this.apiUrl+"archivee"+AnneScolaire._id;
    return this.http.post<any>(anneeScolaireUrl,AnneScolaire,httpOptions1);
  }


}
