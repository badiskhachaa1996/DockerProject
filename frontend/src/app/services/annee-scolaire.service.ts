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

  archiveee(AnneeScolaire: any){
    let anneeScolaireUrl=this.apiUrl+"archivee"+AnneeScolaire._id;
    return this.http.post<any>(anneeScolaireUrl,AnneeScolaire,httpOptions1);
  }
  update(anneeScolaire :any){
    let registreUrl=this.apiUrl+"updateById/"+anneeScolaire._id;
    return this.http.post<any>(registreUrl,anneeScolaire,httpOptions1);
  }
  hide(id :any){
    let registreUrl=this.apiUrl+"hideById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  show(id :any){
    let registreUrl=this.apiUrl+"showById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  seeAll(){
    let registreUrl=this.apiUrl+"seeAll";
    return this.http.get<any>(registreUrl,httpOptions1);
  }


}