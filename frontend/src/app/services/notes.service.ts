import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json','Access-Control-Allow-Origin':'*'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;


@Injectable({
  providedIn: 'root'
})
export class NotesService {

  apiUrl =environment.origin+ "notes/"

  constructor(private http: HttpClient) { }

  create(notif: any) {
    let url = this.apiUrl + "create";
    return this.http.post<any>(url, notif, httpOptions1);
  }

  getById(id:string){
    let registreUrl=this.apiUrl+"getById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getAll() {
    let loginUrl = this.apiUrl + "getAll";
    return this.http.get<any>(loginUrl, httpOptions1);
  }

  getAllByUserId(id:string){
    let registreUrl=this.apiUrl+"getAllByUser/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getAllByExamen(id:string){
    let registreUrl=this.apiUrl+"getAllByExamen/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }



}
