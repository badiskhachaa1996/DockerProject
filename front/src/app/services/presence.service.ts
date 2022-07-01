import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Presence } from '../models/Presence';


@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;

  apiUrl =environment.origin+ "presence/"

  constructor(private http: HttpClient) { }
  create(data: Presence) {
    let url = this.apiUrl + "create";
    return this.http.post<any>(url, data, this.httpOptions1);
  }

  getAll() {
    let loginUrl = this.apiUrl + "getAll";
    return this.http.post<any>(loginUrl, this.httpOptions1);
  }

  getById(id:string){
    let registreUrl=this.apiUrl+"getById/"+id;
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }

  getAllByUser(id:string){
    let registreUrl=this.apiUrl+"getAllByUser/"+id;
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }

  getAllBySeance(id:string){
    let registreUrl=this.apiUrl+"getAllBySeance/"+id;
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }

  isPresent(id:string){
    let registreUrl=this.apiUrl+"isPresent/"+id;
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }

  addSignature(data){
    let registreUrl=this.apiUrl+"addSignature/"+data._id;
    return this.http.post<any>(registreUrl,data,this.httpOptions1);
  }
  
  addJustificatif(data){
    let registreUrl=this.apiUrl+"addJustificatif/"+data.user_id+"/"+data.seance_id;
    return this.http.post<any>(registreUrl,data,this.httpOptions1);
  }

  getSignature(id:string){
    let registreUrl=this.apiUrl+"getSignature/"+id;
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }
  
  getJustificatif(id:string){
    let registreUrl=this.apiUrl+"getJustificatif/"+id;
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }

  getPDF(id:string){
    let registreUrl=this.apiUrl+"getPDF/"+id;
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }

}
