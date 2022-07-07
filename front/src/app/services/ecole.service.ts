import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EcoleService {

  apiUrl =environment.origin+ "ecole/"
  httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;
  constructor(private http : HttpClient) { }

  getAll(){
    let ecoleUrl=this.apiUrl+"getAll";
    return this.http.get<any>(ecoleUrl,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllByAnnee(id:any){
    let ecoleUrl=this.apiUrl+"getAllByAnnee/"+id;
    return this.http.get<any>(ecoleUrl,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getByID(id: any){
    let ecoleUrl=this.apiUrl+"getById/"+id;
    return this.http.get<any>(ecoleUrl,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  
 create(ecole: any){
    let ecoleUrl=this.apiUrl+"createecole";
    return this.http.post<any>(ecoleUrl,ecole,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  
  edit(ecole: any){
    let ecoleUrl=this.apiUrl+"editById/"+ecole._id;
    return this.http.post<any>(ecoleUrl,ecole,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  
}}