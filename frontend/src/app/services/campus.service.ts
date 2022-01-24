import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Campus } from '../models/Campus';
import { environment } from 'src/environments/environment';

import { AnneeScolaire } from '../models/AnneeScolaire';
const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json','Access-Control-Allow-Origin':'*'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})
export class CampusService {

apiUrl =environment.origin+ "campus/"
  constructor(private http : HttpClient, private _router: Router) { }

  
  getAll(){
    let campusUrl=this.apiUrl+"getAll";
    return this.http.get<any>(campusUrl,httpOptions1);
  }

  getByID(Campus: any){
    let campusUrl=this.apiUrl+"getById/"+Campus;
    return this.http.get<any>(campusUrl,httpOptions1);
  }

  createCampus(campus: any){
    let campusUrl=this.apiUrl+"createcampus";
    return this.http.post<any>(campusUrl,campus,httpOptions1);
  }
  edit(Campus: any){
    let campusUrl=this.apiUrl+"editById/"+Campus._id;
    return this.http.post<any>(campusUrl,Campus,httpOptions1);
  
}
getAllByEcole(id:any){
  let campusUrl=this.apiUrl+"getAllByEcole/"+id;
  return this.http.get<any>(campusUrl,httpOptions1);
}

 
}
