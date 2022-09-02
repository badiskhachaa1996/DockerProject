import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
const io = require("socket.io-client");
import { environment } from 'src/environments/environment';
import { Etudiant } from '../models/Etudiant';
import { Inscription } from '../models/Inscription';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) };
  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) };

  apiUrl = environment.origin + "user/"

  socket = io(environment.origin.replace('/soc', ''));

  constructor(private http: HttpClient) { }

  register(user: any) {
    let API_URL = this.apiUrl + "registre";
    return this.http.post(API_URL, user)
  }

  registerAdmin(user: any) {
    let API_URL = this.apiUrl + "registre";
    return this.http.post(API_URL, user, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  login(user: any) {
    let loginUrl = this.apiUrl + "login";
    return this.http.post<any>(loginUrl, user, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  getAll() {
    let loginUrl = this.apiUrl + "getAll";
    return this.http.get<any>(loginUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getById(id) {
    let loginUrl = this.apiUrl + "getById/" + id;
    return this.http.get<any>(loginUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }
    );
  }

  //Recuperation des infos du user
  getInfoById(id: string) {
    let url = this.apiUrl + 'getInfoById/' + id;
    return this.http.get<User>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getPopulate(id: string) {
    let url = this.apiUrl + 'getPopulate/' + id;
    return this.http.get<User>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getByEmail(email: string) {
    let registreUrl = this.apiUrl + "getByEmail/" + email;
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  update(user: User) {
    let registreUrl = this.apiUrl + "updateById/" + user._id;
    return this.http.post<any>(registreUrl, { user }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  updateEtudiant(user: User, etudiant: Etudiant) {
    let registreUrl = this.apiUrl + "updateEtudiant/" + user._id;
    return this.http.post<any>(registreUrl, { user, newEtudiant: etudiant }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  /*updateAlternant(user:User,alternant:Alternant){
    let registreUrl=this.apiUrl+"updateAlternant/"+user._id;
    return this.http.post<any>(registreUrl,{user,newAlternant:alternant},this.{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }*/



  getAllByService(id) {
    let loginUrl = this.apiUrl + "getAllbyService/" + id;
    return this.http.get<any>(loginUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
      ;
  }
  getAllByemailPerso(id) {
    let loginUrl = this.apiUrl + "getAllbyEmailPerso/" + id;
    return this.http.get<any>(loginUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
      ;
  }


  getAllAgent() {
    let loginUrl = this.apiUrl + "getAllAgent/";
    return this.http.get<any>(loginUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  uploadimageprofile(data: FormData) {
    let url = this.apiUrl + "file";
    return this.http.post<any>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  getProfilePicture(id) {
    let url = this.apiUrl + "getProfilePicture/" + id;
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  updatePassword(id: string, data) {
    let url = this.apiUrl + "updatePassword/" + id;
    return this.http.post<any>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  reloadImage(data) {
    this.socket.emit("reloadImage", (data))
  }

  AuthMicrosoft(email, name) {
    let url = this.apiUrl + "AuthMicrosoft";
    return this.http.post<any>(url, { email, name }, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  WhatTheRole(id) {
    let url = this.apiUrl + "WhatTheRole/" + id;
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  verifPassword(tbObj: any) {
    let url = this.apiUrl + "verifyUserPassword";
    return this.http.post(url, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  updatePwd(id: string, pwd) {
    let url = this.apiUrl + "updatePwd/" + id;
    return this.http.post<any>(url, { pwd }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  HowIsIt(user_id) {
    let url = this.apiUrl + "HowIsIt/" + user_id;
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  pwdToken(email) {
    let url = this.apiUrl + "pwdToken/" + email;
    return this.http.post<any>(url,  { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) })
  }
  reinitPwd(pwdTokenID,pwd) {
    let url = this.apiUrl + "reinitPwd/" +pwdTokenID;
    return this.http.post<any>(url, {pwd},{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) })
  }  

  /*TESTMAIL(){
    let url = this.apiUrl	+"TESTMAIL"
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }*/

}
