import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders().append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  apiUrl ="http://localhost:3000/message/"

  constructor(private http : HttpClient) { }
  create(message){
    let registreUrl=this.apiUrl+"create";
    return this.http.post<any>(registreUrl,message,httpOptions);
  }

  update(message :any){
    let registreUrl=this.apiUrl+"updateById/"+message.id;
    return this.http.post<any>(registreUrl,message,httpOptions1);
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

  getAllByTicketID(id){
    let registreUrl=this.apiUrl+"getAllByTicketID/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getAllDic(){
    let registreUrl=this.apiUrl+"getAllDic";
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  downloadFile(id){
    let registreUrl=this.apiUrl+"downloadFile/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }
}
