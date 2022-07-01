import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Classe } from '../models/Classe';



@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  apiUrl =environment.origin+ "classe/"
  httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;
  constructor(private http : HttpClient) { }

  create(classe: Classe){
    let registreUrl=this.apiUrl+"create";
    return this.http.post<Classe>(registreUrl,classe,this.httpOptions1);
  }

  update(classe : Classe){
    let registreUrl=this.apiUrl+"updateById/";
    return this.http.post<Classe>(registreUrl,classe,this.httpOptions1);
  }
 
  get(id:string){
    let registreUrl=this.apiUrl+"getById/"+id;
    return this.http.get<Classe>(registreUrl,this.httpOptions1);
  }

  getAll(){
    let registreUrl=this.apiUrl+"getAll";
    return this.http.get<Classe[]>(registreUrl,this.httpOptions1);
  }

  hide(id :any){
    let registreUrl=this.apiUrl+"hideById/"+id;
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }

  show(id :any){
    let registreUrl=this.apiUrl+"showById/"+id;
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }

  seeAll(){
    let registreUrl=this.apiUrl+"seeAll";
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }

}
