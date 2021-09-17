import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '../models/notification';
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import {tap} from 'rxjs/operators';
const io = require("socket.io-client");

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
const httpOptions1 = { headers: new HttpHeaders().append('token', localStorage.getItem('token')) };



@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notifs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  socket = io("http://localhost:3000");
  apiUrl ="http://localhost:3000/notification/"

  constructor(private http: HttpClient) { }
// private _refreshNeeded = new Subject<void>();
// get refreshNeeded(){
//     return this._refreshNeeded;
// }
  newNotif(Notif){
    this.socket.emit("NewNotif",(Notif.doc))
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
    return this.http.get<any>(registreUrl,httpOptions)
    // .pipe(
    //   tap(() => {
    //     this._refreshNeeded.next();
    //   })
    //   )
    ;
  }

  get20ByUserID(id:string){
    let registreUrl=this.apiUrl+"get20ByUserID/"+id;
    return this.http.get<any>(registreUrl,httpOptions);
  }
  viewNotifByID(id){
    let registreUrl=this.apiUrl+"viewNotifByID/"+id;
    return this.http.get<any>(registreUrl,httpOptions1)
   ;
  }

  viewNotifs(notifications:Notification[]){
    let registreUrl=this.apiUrl+"viewNotifs";
    return this.http.post<any>(registreUrl,{notifications},httpOptions1)
 ;
  }
  reloadNotif(data){
    this.socket.emit("reloadNotif",(data))
  }

}
