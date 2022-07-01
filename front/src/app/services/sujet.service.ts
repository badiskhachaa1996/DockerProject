import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SujetService {

  httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;

  apiUrl =environment.origin+ "sujet/"
  constructor(private http : HttpClient, private _router: Router) { }


  public addSujet(sujet: any){
    let add_sujet=this.apiUrl+"addsujet";
    return this.http.post<any>(add_sujet,sujet,this.httpOptions1);
  }


  getAll() {
    let loginUrl = this.apiUrl + "getAll";
    return this.http.get<any>(loginUrl, this.httpOptions1);
  }

  update(sujet :any){
    let registreUrl=this.apiUrl+"updateById/"+sujet.id;
    return this.http.post<any>(registreUrl,sujet,this.httpOptions1);
  }

  delete(id:string){
    let registreUrl=this.apiUrl+"deleteById/"+id;
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }

  getASujetByid(id:string){
    let registreUrl=this.apiUrl+"getById/"+id;
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }


}
