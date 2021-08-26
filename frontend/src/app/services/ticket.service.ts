import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Ticket} from "../models/Ticket"

const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders().append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  apiUrl ="http://localhost:3000/ticket/"

  constructor(private http : HttpClient) {  }

  create(ticket){
    let registreUrl=this.apiUrl+"create";
    return this.http.post<any>(registreUrl,ticket,httpOptions);
  }

  update(ticket :Ticket){
    let registreUrl=this.apiUrl+"updateById/"+ticket.id;
    return this.http.post<any>(registreUrl,ticket,httpOptions1);
  }

  delete(id:string){
    let registreUrl=this.apiUrl+"deleteById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getAllByUser(id:string){
    let registreUrl=this.apiUrl+"getAllbyUser/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getFirstMessage(id:string){
    let registreUrl=this.apiUrl+"getFirstMessage/"+id;
    return this.http.get<any>(registreUrl);
  }


}
