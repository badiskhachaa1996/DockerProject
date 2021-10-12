import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json','Access-Control-Allow-Origin':'*'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;
@Injectable({
  providedIn: 'root'
})

export class ServService {

  apiUrl = environment.origin+"service/"

  constructor(private http: HttpClient) { }

  public addService(service: any) {
    let add_serv = this.apiUrl + "addService";
    return this.http.post<any>(add_serv, service, httpOptions1);
  }

  getAll() {
    let loginUrl = this.apiUrl + "getAll";
    return this.http.get<any>(loginUrl, httpOptions1);
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
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getDic(){
    let registreUrl=this.apiUrl+"getDic";
    return this.http.get<any>(registreUrl,httpOptions1);
  }
}