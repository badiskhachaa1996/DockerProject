import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../models/Service';

const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders().append('token', localStorage.getItem('token')) }​​​​​​​​;
@Injectable({
  providedIn: 'root'
})

export class ServService {
  
  apiUrl ="http://localhost:3000/"

  constructor(private http : HttpClient, private _router: Router) {  }

 public  addService(service :Service){
    let add_serv=this.apiUrl+"service/addService";
    return this.http.post<any>(add_serv,service,httpOptions);
  }
  

}