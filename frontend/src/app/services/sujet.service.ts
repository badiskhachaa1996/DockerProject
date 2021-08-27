import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Sujet } from '../models/Sujet';
const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders().append('token', localStorage.getItem('token')) }​​​​​​​​;
@Injectable({
  providedIn: 'root'
})
export class SujetService {
  createServices(value: any) {
    throw new Error('Method not implemented.');
  }

  apiUrl ="http://localhost:3000/"
  constructor(private http : HttpClient, private _router: Router) { }


  public  addSujet(sujet: Sujet){
    let add_sujet=this.apiUrl+"sujet/addsujet";
    return this.http.post<any>(add_sujet,sujet,httpOptions);
  }


}
