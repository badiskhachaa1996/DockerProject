import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {Ticket} from "../models/Ticket"

const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders().append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  apiUrl =environment.origin+ "ticket/"

  constructor(private http : HttpClient) {  }

  create(ticket){
    let registreUrl=this.apiUrl+"create";
    ticket.secret=environment.key
    return this.http.post<any>(registreUrl,ticket,httpOptions1);
  }

  createForUser(ticket){
    let registreUrl=this.apiUrl+"createForUser";
    ticket.secret=environment.key
    return this.http.post<any>(registreUrl,ticket,httpOptions1);
  }

  updateAll(ticket :any){
    ticket.secret=environment.key
    let registreUrl=this.apiUrl+"updateById/"+ticket.id;
    return this.http.post<any>(registreUrl,ticket,httpOptions1);
  }

  //Update le ticket et son premier Message
  update(ticket){
    let registreUrl=this.apiUrl+"update/"+ticket.id;
    ticket.secret=environment.key
    return this.http.post<any>(registreUrl,ticket,httpOptions1);
  }

  delete(id:string){
    let registreUrl=this.apiUrl+"deleteById/"+id;
    return this.http.post<any>(registreUrl,{secret:environment.key},httpOptions1);
  }
  //Avoir tous les tickets d'un User via son ID
  getAllByUser(id:string){
    let registreUrl=this.apiUrl+"getAllbyUser/"+id;
    return this.http.post<any>(registreUrl,{secret:environment.key},httpOptions1);
  }

  getAll(){
    let registreUrl=this.apiUrl+"getAll";
    return this.http.post<any>(registreUrl,{secret:environment.key},httpOptions1);
  }

  getQueue(){
    let registreUrl=this.apiUrl+"getQueue";
    return this.http.post<any>(registreUrl,{secret:environment.key},httpOptions1);
  }

  getAccAff(id){
    let registreUrl=this.apiUrl+"getAccAff/"+id;
    return this.http.post<any>(registreUrl,{secret:environment.key},httpOptions1);
  }

  getTicketsByService(id){
    let registreUrl=this.apiUrl+"getTicketsByService/"+id;
    return this.http.post<any>(registreUrl,{secret:environment.key},httpOptions1);
  }

  getQueueByService(id){
    let registreUrl=this.apiUrl+"getQueueByService/"+id;
    return this.http.post<any>(registreUrl,{secret:environment.key},httpOptions1);
  }

  getAccAffByService(id){
    let registreUrl=this.apiUrl+"getAccAffByService/"+id;
    return this.http.post<any>(registreUrl,{secret:environment.key},httpOptions1);
  }

  getAllAccAff(){
    let registreUrl=this.apiUrl+"getAllAccAff";
    return this.http.post<any>(registreUrl,{secret:environment.key},httpOptions1);
  }

  setAccAff(info:any){
    let registreUrl=this.apiUrl+"AccAff/"+info.id;
    info.secret=environment.key
    return this.http.post<any>(registreUrl,info,httpOptions1);
  }

  changeService(info){
    let registreUrl=this.apiUrl+"changeService/"+info.id;
    info.secret=environment.key
    return this.http.post<any>(registreUrl,info,httpOptions1);
  }

  changeStatut(data){
    let registreUrl=this.apiUrl+"changeStatut/"+data.id;
    data.secret=environment.key
    return this.http.post<any>(registreUrl,data,httpOptions1);
  }

  revert(data){
    let registreUrl=this.apiUrl+"revertTicket/"+data.id;
    data.secret=environment.key
    return this.http.post<any>(registreUrl,data,httpOptions);
  }

}
