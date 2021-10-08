import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Classe } from '../models/Classe';

const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders().append('token', localStorage.getItem('token')) }​​​​​​​​;


@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  apiUrl =environment.origin+ "classe/"
  constructor(private http : HttpClient) { }

  create(classe:Classe){
    let registreUrl=this.apiUrl+"create";
    return this.http.post<any>(registreUrl,classe,httpOptions);
  }

  update(classe :Classe){
    let registreUrl=this.apiUrl+"updateById/"+classe._id;
    return this.http.post<any>(registreUrl,classe,httpOptions1);
  }

  delete(id:string){
    let registreUrl=this.apiUrl+"deleteById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  get(id:string){
    let registreUrl=this.apiUrl+"getById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getAll(){
    let registreUrl=this.apiUrl+"getAll";
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  hide(id :any){
    let registreUrl=this.apiUrl+"hideById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  show(id :any){
    let registreUrl=this.apiUrl+"showById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  seeAll(){
    let registreUrl=this.apiUrl+"seeAll";
    return this.http.get<any>(registreUrl,httpOptions1);
  }
}
