import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User';

const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders().append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  apiUrl ="http://localhost:3000/"
  private Services = [];

  constructor(private http : HttpClient, private _router: Router) {  }

  register(user :User){
    let registreUrl=this.apiUrl+"user/registre";
    return this.http.post<any>(registreUrl,user,httpOptions);
  }
  login(user){
    let loginUrl=this.apiUrl+"user/login";
    return this.http.post<any>(loginUrl,user,httpOptions);
  }

  getAll(){
    let loginUrl=this.apiUrl+"user/getAll";
    return this.http.get<any>(loginUrl,httpOptions1);
  }

  getById(id){
    let loginUrl=this.apiUrl+"user/getUser/"+id;
    return this.http.get<any>(loginUrl,httpOptions1);
  }
  createServices(service){
    const newService = { id: Date.now(), ...service};
    this.Services = [service, ...this.Services] ;
    console.log(this.Services);
     }

     getServices(){
       return this.Services;
     }
}
