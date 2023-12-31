import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '../models/notification';
import { BehaviorSubject } from 'rxjs';
const io = require("socket.io-client");
import { environment } from 'src/environments/environment';
import { User } from '../models/User';



@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notifs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  socket = io(environment.origin.replace('/soc', ''));
  apiUrl = environment.origin + "notification/"
  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  constructor(private http: HttpClient) { }

  create(notif: Notification) {
    let url = this.apiUrl + "create";
    return this.http.post<any>(url, notif, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  createV2(notif: Notification, module, role) {
    let url = this.apiUrl + "createV2";
    return this.http.post<User[]>(url, { ...notif, module, role });
  }

  getAll() {
    let loginUrl = this.apiUrl + "getAll";
    return this.http.get<any>(loginUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  update(notif: any) {
    let registreUrl = this.apiUrl + "updateById/" + notif._id;
    return this.http.post<any>(registreUrl, notif, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  delete(id: string) {
    let registreUrl = this.apiUrl + "deleteById/" + id;
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  deleteAll(id: string) {
    let registreUrl = this.apiUrl + "deleteAll/" + id;
    return this.http.delete<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getById(id: string) {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByUserId(id: string) {
    let registreUrl = this.apiUrl + "getAllByUserID/" + id;
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  get20ByUserID(id: string) {
    let registreUrl = this.apiUrl + "get20ByUserID/" + id;
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAdmissionNotifi() {
    let registreUrl = this.apiUrl + "getAdmissionNotifi";
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }



  newNotif(Notif) {
    this.socket.emit("NewNotif", (Notif.doc))
  }

  viewNotifs(notifications: Notification[]) {
    let registreUrl = this.apiUrl + "viewNotifs";
    return this.http.post<any>(registreUrl, { notifications }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
      ;
  }
  reloadNotif(data) {
    this.socket.emit("reloadNotif", (data))
  }

  newEtudiantIMS(user) {
    let url = this.apiUrl + "newEtudiantIMS"
    return this.http.post<any>(url, user, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  newDocument(email, doc) {
    let url = this.apiUrl + "newDocument/" + email + "/" + doc
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

}
