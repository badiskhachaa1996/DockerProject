import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../models/Service';
import { Sujet } from '../models/Sujet';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
const httpOptions1 = { headers: new HttpHeaders().append('token', localStorage.getItem('token')) };
@Injectable({
  providedIn: 'root'
})

export class ServService {

  apiUrl ="http://localhost:3000/"

  constructor(private http: HttpClient) { }

  public addService(service: Service) {
    let add_serv = this.apiUrl + "service/addService";
    return this.http.post<any>(add_serv, service, httpOptions);
  }
  update(service :Service){
    let registreUrl=this.apiUrl+"updateById/"+service.id;
    return this.http.post<any>(registreUrl,service,httpOptions1);
  }
  updateNew(newService){
    let registreUrl=this.apiUrl+"updateNew/"+newService.id;
    return this.http.post<any>(registreUrl,newService,httpOptions1);
  }

  getAll() {
    let loginUrl = this.apiUrl + "service/getAll";
    return this.http.get<any>(loginUrl, httpOptions1);
  }


  delete(id:string){
    let registreUrl=this.apiUrl+"deleteById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getAServiceByid(id:string){
    let registreUrl=this.apiUrl+"service/getById/"+id;
    return this.http.get<any>(registreUrl,httpOptions);
  }


  


  
  

}