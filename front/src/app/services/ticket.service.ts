import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Ticket } from '../models/Ticket';


@Injectable({
  providedIn: 'root'
})
export class TicketService {

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  apiUrl = environment.origin + "ticket/"

  constructor(private http: HttpClient) { }

  create(ticket) {
    let registreUrl = this.apiUrl + "create";
    return this.http.post<any>(registreUrl, ticket, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  createAdmin(ticket) {
    let registreUrl = this.apiUrl + "createAdmin";
    return this.http.post<{ message: string, doc: Ticket }>(registreUrl, ticket, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  createForUser(ticket) {
    let registreUrl = this.apiUrl + "createForUser";
    return this.http.post<any>(registreUrl, ticket, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  updateAll(ticket: any) {
    let registreUrl = this.apiUrl + "updateById/" + ticket.id;
    return this.http.post<any>(registreUrl, ticket, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Update le ticket et son premier Message
  update(ticket) {
    let id = ticket.id
    if (!id)
      id = ticket._id
    let registreUrl = this.apiUrl + "update/" + id;
    return this.http.post<any>(registreUrl, ticket, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  delete(id: string) {
    let registreUrl = this.apiUrl + "deleteById/" + id;
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  //Avoir tous les tickets d'un User via son ID
  getAllByUser(id: string) {
    let registreUrl = this.apiUrl + "getAllbyUser/" + id;
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }



  getQueue() {
    let registreUrl = this.apiUrl + "getQueue";
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAccAff(id) {
    let registreUrl = this.apiUrl + "getAccAff/" + id;
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getTicketsByService(id) {
    let registreUrl = this.apiUrl + "getTicketsByService/" + id;
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getQueueByService(id) {
    let registreUrl = this.apiUrl + "getQueueByService/" + id;
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAccAffByService(id) {
    let registreUrl = this.apiUrl + "getAccAffByService/" + id;
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllAccAff() {
    let registreUrl = this.apiUrl + "getAllAccAff";
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  setAccAff(info: any) {
    let registreUrl = this.apiUrl + "AccAff/" + info.id;
    return this.http.post<any>(registreUrl, info, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  changeService(info) {
    let registreUrl = this.apiUrl + "changeService/" + info.id;
    return this.http.post<any>(registreUrl, info, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  changeStatut(data) {
    let registreUrl = this.apiUrl + "changeStatut/" + data.id;
    return this.http.post<any>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  revert(data) {
    let registreUrl = this.apiUrl + "revertTicket/" + data.id;
    return this.http.post<any>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Récupération du nombre de ticket dans la file d'attente
  getCountWaiting() {
    let registreUrl = this.apiUrl + "getCountWaiting";
    return this.http.get<Ticket[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Récupération du nombre de ticket en cours de traitement
  getCountTraitement() {
    let registreUrl = this.apiUrl + "getCountTraitement";
    return this.http.get<Ticket[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getCountTraite() {
    let registreUrl = this.apiUrl + "getCountTraite";
    return this.http.get<Ticket[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Requête de récupération du nombre de ticket crée par un user en cours de traitement
  getCountTicketUserInWaiting(id: string) {
    let registreUrl = this.apiUrl + "getCountTicketUserInWaiting/" + id;
    return this.http.get<Ticket[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Requête de récupération du nombre de ticket crée par un user traité
  getCountTicketUserTraite(id: string) {
    let registreUrl = this.apiUrl + "getCountTicketUserTraite/" + id;
    return this.http.get<Ticket[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Requête de récupération du nombre de ticket crée par un user traité
  getCountTicketUserQueue(id: string) {
    let registreUrl = this.apiUrl + "getCountTicketUserQueue/" + id;
    return this.http.get<Ticket[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  addFile(formdata: FormData) {
    let registreUrl = this.apiUrl + "addFile";
    return this.http.post<Ticket[]>(registreUrl, formdata, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  getAllNonAssigne() {
    let registreUrl = this.apiUrl + "getAllNonAssigne";
    return this.http.get<Ticket[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllRefuse() {
    let registreUrl = this.apiUrl + "getAllRefuse";
    return this.http.get<Ticket[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllTraite() {
    let registreUrl = this.apiUrl + "getAllTraite";
    return this.http.get<Ticket[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllAttenteDeTraitement() {
    let registreUrl = this.apiUrl + "getAllAttenteDeTraitement";
    return this.http.get<Ticket[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
