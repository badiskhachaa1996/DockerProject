import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;
  apiUrl =environment.origin+ "message/"

  constructor(private http : HttpClient) { }

  create(message){
    let registreUrl=this.apiUrl+"create";
    return this.http.post<any>(registreUrl,message,this.httpOptions1);
  }

  update(message :any){
    let registreUrl=this.apiUrl+"updateById/"+message.id;
    return this.http.post<any>(registreUrl,message,this.httpOptions1);
  }

  delete(id:string){
    let registreUrl=this.apiUrl+"deleteById/"+id;
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }

  get(id:string){
    let registreUrl=this.apiUrl+"getById/"+id;
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }

  getAll(){
    let registreUrl=this.apiUrl+"getAll";
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }

  getAllByTicketID(id){
    let registreUrl=this.apiUrl+"getAllByTicketID/"+id;
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }

  getAllDic(){
    let registreUrl=this.apiUrl+"getAllDic";
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }

  downloadFile(id){
    let registreUrl=this.apiUrl+"downloadFile/"+id;
    return this.http.get<any>(registreUrl,this.httpOptions1);
  }
}
