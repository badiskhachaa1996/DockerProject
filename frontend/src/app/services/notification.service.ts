import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '../models/notification';

const io = require("socket.io-client");

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
const httpOptions1 = { headers: new HttpHeaders().append('token', localStorage.getItem('token')) };



@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  socket = io("http://localhost:3000");
  apiUrl ="http://localhost:3000/notification/"

  constructor(private http: HttpClient) { }

  newNotif(Notif,userid){
    this.socket.emit("NewNotif",({notif:Notif,userid:userid}))
  }

  create(notif: Notification) {
    let url = this.apiUrl + "create";
    return this.http.post<any>(url, notif, httpOptions);
  }

  getAll() {
    let loginUrl = this.apiUrl + "getAll";
    return this.http.get<any>(loginUrl, httpOptions);
  }

  update(notif :any){
    let registreUrl=this.apiUrl+"updateById/"+notif._id;
    return this.http.post<any>(registreUrl,notif,httpOptions1);
  }

  delete(id:string){
    let registreUrl=this.apiUrl+"deleteById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getById(id:string){
    let registreUrl=this.apiUrl+"getById/"+id;
    return this.http.get<any>(registreUrl,httpOptions);
  }

  getAllByUserId(id:string){
    let registreUrl=this.apiUrl+"getAllByUserID/"+id;
    return this.http.get<any>(registreUrl,httpOptions);
  }
}
