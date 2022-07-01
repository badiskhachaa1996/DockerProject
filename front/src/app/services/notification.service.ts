import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '../models/notification';
import { BehaviorSubject } from 'rxjs';
const io = require("socket.io-client");
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notifs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  socket = io(environment.origin.replace('/soc', ''));
  apiUrl = environment.origin + "notification/"
  httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;

  constructor(private http: HttpClient) { }

  create(notif: any) {
    let url = this.apiUrl + "create";
    return this.http.post<any>(url, notif, this.httpOptions1);
  }

  getAll() {
    let loginUrl = this.apiUrl + "getAll";
    return this.http.get<any>(loginUrl, this.httpOptions1);
  }

  update(notif: any) {
    let registreUrl = this.apiUrl + "updateById/" + notif._id;
    return this.http.post<any>(registreUrl, notif, this.httpOptions1);
  }

  delete(id: string) {
    let registreUrl = this.apiUrl + "deleteById/" + id;
    return this.http.get<any>(registreUrl, this.httpOptions1);
  }

  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.http.get<any>(registreUrl, this.httpOptions1);
  }

  getAllByUserId(id: string) {
    let registreUrl = this.apiUrl + "getAllByUserID/" + id;
    return this.http.get<any>(registreUrl, this.httpOptions1);
  }

  get20ByUserID(id: string) {
    let registreUrl = this.apiUrl + "get20ByUserID/" + id;
    return this.http.get<any>(registreUrl, this.httpOptions1);
  }

  newNotif(Notif) {
    this.socket.emit("NewNotif", (Notif.doc))
  }

  viewNotifs(notifications: Notification[]) {
    let registreUrl = this.apiUrl + "viewNotifs";
    return this.http.post<any>(registreUrl, { notifications }, this.httpOptions1)
      ;
  }
  reloadNotif(data) {
    this.socket.emit("reloadNotif", (data))
  }

}
