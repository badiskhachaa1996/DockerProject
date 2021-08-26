import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../models/Service';
import { Sujet } from '../models/Sujet';

const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders().append('token', localStorage.getItem('token')) }​​​​​​​​;
@Injectable({
  providedIn: 'root'
})

export class ServService {
  private serviceForm = [];
  apiUrl ="http://localhost:3000/"

  constructor(private http : HttpClient, private _router: Router) {  }

 public  addService(service :Service){
    let add_serv=this.apiUrl+"service/addService";
    return this.http.post<any>(add_serv,service,httpOptions);
  }
  

  update(sujet :Sujet){
    let registreUrl=this.apiUrl+"updateById/"+sujet.service_id;
    return this.http.post<any>(registreUrl,sujet,httpOptions1);
  }

  delete(id:string){
    let registreUrl=this.apiUrl+"deleteById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getAServiceByid(id:string){
    let registreUrl=this.apiUrl+"service/getById/"+id;
    return this.http.get<any>(registreUrl,httpOptions);
  }
  getAll(){
    let loginUrl=this.apiUrl+"service/getAll";
    return this.http.get<any>(loginUrl,httpOptions1);
  }

  


  createServices(service){
    this.serviceForm = [service, ...this.serviceForm] ;
    console.log(this.serviceForm);
     }

     getServices(){
       return this.serviceForm;
     }

  
  

}