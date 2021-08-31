import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';

const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders().append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  apiUrl ="http://localhost:3000/"
  private Services = [];

  constructor(private http : HttpClient) {  }

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
    let loginUrl=this.apiUrl+"user/getById/"+id;
    return this.http.get<any>(loginUrl,httpOptions1);
  }

  update(user :User){
    let registreUrl=this.apiUrl+"user/updateById/"+user.id;
    return this.http.post<any>(registreUrl,user,httpOptions1);
  }
}
