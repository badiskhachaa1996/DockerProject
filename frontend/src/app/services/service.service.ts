import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
const httpOptions1 = { headers: new HttpHeaders().append('token', localStorage.getItem('token')) };
@Injectable({
  providedIn: 'root'
})

export class ServService {

  apiUrl = environment.origin+"service/"

  constructor(private http: HttpClient) { }

  public addService(service: any) {
    service.secret=environment.key
    let add_serv = this.apiUrl + "addService";
    return this.http.post<any>(add_serv, service, httpOptions1);
  }

  getAll() {
    let loginUrl = this.apiUrl + "getAll";
    return this.http.post<any>(loginUrl,{secret:environment.key}, httpOptions1);
  }


  update(service :any){
    service.secret=environment.key
    let registreUrl=this.apiUrl+"updateById/"+service.id;
    return this.http.post<any>(registreUrl,service,httpOptions1);
  }

  delete(id:string){
    let registreUrl=this.apiUrl+"deleteById/"+id;
    return this.http.post<any>(registreUrl,{secret:environment.key},httpOptions1);
  }

  getAServiceByid(id:string){
    let registreUrl=this.apiUrl+"getById/"+id;
    return this.http.post<any>(registreUrl,{secret:environment.key},httpOptions1);
  }

  getDic(){
    let registreUrl=this.apiUrl+"getDic";
    return this.http.post<any>(registreUrl,{secret:environment.key},httpOptions1);
  }
}