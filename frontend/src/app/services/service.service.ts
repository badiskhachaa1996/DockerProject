import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Service } from '../models/Service';
import { Sujet } from '../models/Sujet';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
const httpOptions1 = { headers: new HttpHeaders().append('token', localStorage.getItem('token')) };
@Injectable({
  providedIn: 'root'
})

export class ServService {

  apiUrl ="http://localhost:3000/service/"

  constructor(private http: HttpClient) { }

  public addService(service: Service) {
    let add_serv = this.apiUrl + "addService";
    return this.http.post<any>(add_serv, service, httpOptions);
  }

  getAll() {
    let loginUrl = this.apiUrl + "getAll";
    return this.http.get<any>(loginUrl, httpOptions);
  }


  update(service :any){
    let registreUrl=this.apiUrl+"updateById/"+service.id;
    return this.http.post<any>(registreUrl,service,httpOptions1);
  }

  delete(id:string){
    let registreUrl=this.apiUrl+"deleteById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getAServiceByid(id:string){
    let registreUrl=this.apiUrl+"getById/"+id;
    return this.http.get<any>(registreUrl,httpOptions);
  }

}