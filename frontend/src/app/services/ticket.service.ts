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
    return this.http.post<any>(registreUrl,ticket,httpOptions);
  }

  createForUser(ticket){
    let registreUrl=this.apiUrl+"createForUser";
    return this.http.post<any>(registreUrl,ticket,httpOptions);
  }

  updateAll(ticket :any){
    let registreUrl=this.apiUrl+"updateById/"+ticket.id;
    return this.http.post<any>(registreUrl,ticket,httpOptions1);
  }

  //Update le ticket et son premier Message
  update(newTicket){
    let registreUrl=this.apiUrl+"update/"+newTicket.id;
    return this.http.post<any>(registreUrl,newTicket,httpOptions1);
  }

  delete(id:string){
    let registreUrl=this.apiUrl+"deleteById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }
  //Avoir tous les tickets d'un User via son ID
  getAllByUser(id:string){
    let registreUrl=this.apiUrl+"getAllbyUser/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getAll(){
    let registreUrl=this.apiUrl+"getAll";
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getQueue(){
    let registreUrl=this.apiUrl+"getQueue";
    return this.http.get<any>(registreUrl);
  }

  getAccAff(id){
    let registreUrl=this.apiUrl+"getAccAff/"+id;
    return this.http.get<any>(registreUrl);
  }

  getTicketsByService(id){
    let registreUrl=this.apiUrl+"getTicketsByService/"+id;
    return this.http.get<any>(registreUrl);
  }

  getQueueByService(id){
    let registreUrl=this.apiUrl+"getQueueByService/"+id;
    return this.http.get<any>(registreUrl);
  }

  getAccAffByService(id){
    let registreUrl=this.apiUrl+"getAccAffByService/"+id;
    return this.http.get<any>(registreUrl);
  }

  getAllAccAff(){
    let registreUrl=this.apiUrl+"getAllAccAff";
    return this.http.get<any>(registreUrl);
  }

  setAccAff(info:any){
    let registreUrl=this.apiUrl+"AccAff/"+info.id;
    return this.http.post<any>(registreUrl,info,httpOptions1);
  }

  changeService(info){
    let registreUrl=this.apiUrl+"changeService/"+info.id;
    return this.http.post<any>(registreUrl,info,httpOptions1);
  }

  changeStatut(data){
    let registreUrl=this.apiUrl+"changeStatut/"+data.id;
    return this.http.post<any>(registreUrl,data,httpOptions1);
  }

  revert(data){
    let registreUrl=this.apiUrl+"revertTicket/"+data.id;
    return this.http.post<any>(registreUrl,data,httpOptions);
  }

}
