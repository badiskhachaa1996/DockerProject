import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Ticket } from '../models/Ticket';
const httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  apiUrl =environment.origin+ "ticket/"

  constructor(private http : HttpClient) {  }

  create(ticket){
    let registreUrl=this.apiUrl+"create";
    return this.http.post<any>(registreUrl,ticket,httpOptions1);
  }

  createForUser(ticket){
    let registreUrl=this.apiUrl+"createForUser";
    return this.http.post<any>(registreUrl,ticket,httpOptions1);
  }

  updateAll(ticket :any){
    let registreUrl=this.apiUrl+"updateById/"+ticket.id;
    return this.http.post<any>(registreUrl,ticket,httpOptions1);
  }

  //Update le ticket et son premier Message
  update(ticket){
    let registreUrl=this.apiUrl+"update/"+ticket.id;
    return this.http.post<any>(registreUrl,ticket,httpOptions1);
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
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getAccAff(id){
    let registreUrl=this.apiUrl+"getAccAff/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getTicketsByService(id){
    let registreUrl=this.apiUrl+"getTicketsByService/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getQueueByService(id){
    let registreUrl=this.apiUrl+"getQueueByService/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getAccAffByService(id){
    let registreUrl=this.apiUrl+"getAccAffByService/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getAllAccAff(){
    let registreUrl=this.apiUrl+"getAllAccAff";
    return this.http.get<any>(registreUrl,httpOptions1);
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
    return this.http.post<any>(registreUrl,data,httpOptions1);
  }

  //Récupération du nombre de ticket dans la file d'attente
  getCountWaiting()
  {
    let registreUrl = this.apiUrl + "getCountWaiting";
    return this.http.get<Ticket[]>(registreUrl, httpOptions1);
  }

  //Récupération du nombre de ticket en cours de traitement
  getCountTraitement()
  {
    let registreUrl = this.apiUrl + "getCountTraitement";
    return this.http.get<Ticket[]>(registreUrl, httpOptions1);
  }

  getCountTraite()
  {
    let registreUrl = this.apiUrl + "getCountTraite";
    return this.http.get<Ticket[]>(registreUrl, httpOptions1);
  }

  //Requête de récupération du nombre de ticket crée par un user en cours de traitement
  getCountTicketUserInWaiting(id: string)
  {
    let registreUrl = this.apiUrl + "getCountTicketUserInWaiting/" + id;
    return this.http.get<Ticket[]>(registreUrl, httpOptions1);
  }

//Requête de récupération du nombre de ticket crée par un user traité
  getCountTicketUserTraite(id: string)
  {
    let registreUrl = this.apiUrl + "getCountTicketUserTraite/" + id;
    return this.http.get<Ticket[]>(registreUrl, httpOptions1);
  }

//Requête de récupération du nombre de ticket crée par un user traité
  getCountTicketUserQueue(id: string)
  {
    let registreUrl = this.apiUrl + "getCountTicketUserQueue/" + id;
    return this.http.get<Ticket[]>(registreUrl, httpOptions1);
  }

}
