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


  public addSujet(sujet: Sujet){
    let add_sujet=this.apiUrl+"sujet/addsujet";
    return this.http.post<any>(add_sujet,sujet,httpOptions);
  }


  getAll() {
    let loginUrl = this.apiUrl + "sujet/getAll";
    return this.http.get<any>(loginUrl, httpOptions1);
  }
<<<<<<< HEAD

  update(sujet :Sujet){
    let registreUrl=this.apiUrl+"sujet/updateById/"+sujet.id;
=======
  updateNew(newSujet){
    let registreUrl=this.apiUrl+"sujet/updateNew/"+newSujet.id;
    return this.http.post<any>(registreUrl,newSujet,httpOptions1);
  }

  update(sujet :Sujet){
    let registreUrl=this.apiUrl+"sujet/updateById/"+sujet.service_id;
>>>>>>> 64e3a73d0f386348fbebba052f4964bce2085d07
    return this.http.post<any>(registreUrl,sujet,httpOptions1);
  }

  delete(id:string){
    let registreUrl=this.apiUrl+"sujet/deleteById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getASujetByid(id:string){
    let registreUrl=this.apiUrl+"sujet/getById/"+id;
    return this.http.get<any>(registreUrl,httpOptions);
  }


}
