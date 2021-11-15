import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ecole } from '../models/Ecole';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json','Access-Control-Allow-Origin':'*'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})
export class EcoleService {

  apiUrl =environment.origin+ "ecole/"
  constructor(private http : HttpClient, private _router: Router) { }

  getAll(){
    let ecoleUrl=this.apiUrl+"getAll";
    return this.http.get<any>(ecoleUrl,httpOptions1);
  }

  getByID(Ecole: any){
    let ecoleUrl=this.apiUrl+"getById/"+Ecole._id;
    return this.http.post<any>(ecoleUrl,Ecole,httpOptions1);
  }
 create(ecole: any){
    let ecoleUrl=this.apiUrl+"createecole";
    return this.http.post<any>(ecoleUrl,ecole,httpOptions1);
  }
  
  edit(Ecole: any){
    let ecoleUrl=this.apiUrl+"editById/"+Ecole._id;
    return this.http.post<any>(ecoleUrl,Ecole,httpOptions1);
  
}}
