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

  apiUrl ="http://localhost:3000/sujet/"
  constructor(private http : HttpClient, private _router: Router) { }


  public addSujet(sujet: Sujet){
    let add_sujet=this.apiUrl+"addsujet";
    return this.http.post<any>(add_sujet,sujet,httpOptions);
  }


  getAll() {
    let loginUrl = this.apiUrl + "getAll";
    return this.http.get<any>(loginUrl, httpOptions1);
  }

  update(sujet :any){
    let registreUrl=this.apiUrl+"updateById/"+sujet.id;
    return this.http.post<any>(registreUrl,sujet,httpOptions1);
  }

  delete(id:string){
    let registreUrl=this.apiUrl+"deleteById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getASujetByid(id:string){
    let registreUrl=this.apiUrl+"getById/"+id;
    return this.http.get<any>(registreUrl,httpOptions);
  }


}
