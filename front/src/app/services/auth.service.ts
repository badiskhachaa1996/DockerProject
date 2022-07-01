import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
const io = require("socket.io-client");
import { environment } from 'src/environments/environment';
import { Etudiant } from '../models/Etudiant';


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
    return this.http.post(API_URL, user, this.httpOptions1)
  }

  login(user: any) {
    let loginUrl = this.apiUrl + "login";
    return this.http.post<any>(loginUrl, user, this.httpOptions);
  }

  getAll() {
    let loginUrl = this.apiUrl + "getAll";
    return this.http.get<any>(loginUrl, this.httpOptions1);
  }

  getById(id) {
    let loginUrl = this.apiUrl + "getById/" + id;
    return this.http.get<any>(loginUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }
    );
  }

  //Recuperation des infos du user
  getInfoById(id: string) {
    let url = this.apiUrl + 'getInfoById/' + id;
    return this.http.get<User>(url, this.httpOptions1);
  }

  getByEmail(email: string) {
    let registreUrl = this.apiUrl + "getByEmail/" + email;
    return this.http.get<any>(registreUrl, this.httpOptions);
  }

  update(user: User) {
    let registreUrl = this.apiUrl + "updateById/" + user._id;
    return this.http.post<any>(registreUrl, { user }, this.httpOptions1);

  }

  updateEtudiant(user: User, etudiant: Etudiant) {
    let registreUrl = this.apiUrl + "updateEtudiant/" + user._id;
    return this.http.post<any>(registreUrl, { user, newEtudiant: etudiant }, this.httpOptions1);
  }

  /*updateAlternant(user:User,alternant:Alternant){
    let registreUrl=this.apiUrl+"updateAlternant/"+user._id;
    return this.http.post<any>(registreUrl,{user,newAlternant:alternant},this.this.httpOptions1);
  }*/



  getAllByService(id) {
    let loginUrl = this.apiUrl + "getAllbyService/" + id;
    return this.http.get<any>(loginUrl, this.httpOptions1)
      ;
  }
  getAllByemailPerso(id) {
    let loginUrl = this.apiUrl + "getAllbyEmailPerso/" + id;
    return this.http.get<any>(loginUrl, this.httpOptions1)
      ;
  }


  getAllAgent() {
    let loginUrl = this.apiUrl + "getAllAgent/";
    return this.http.get<any>(loginUrl, this.httpOptions1)
  }

  uploadimageprofile(data: FormData) {
    let url = this.apiUrl + "file";
    return this.http.post<any>(url, data, this.httpOptions1)
  }

  getProfilePicture(id) {
    let url = this.apiUrl + "getProfilePicture/" + id;
    return this.http.get<any>(url, this.httpOptions1)
  }

  updatePassword(id: string, data) {
    let url = this.apiUrl + "updatePassword/" + id;
    return this.http.post<any>(url, data, this.httpOptions1);
  }

  reloadImage(data) {
    this.socket.emit("reloadImage", (data))
  }

  AuthMicrosoft(email, name) {
    let url = this.apiUrl + "AuthMicrosoft";
    return this.http.post<any>(url, { email, name }, this.httpOptions);
  }

  WhatTheRole(id) {
    let url = this.apiUrl + "WhatTheRole/" + id;
    return this.http.get<any>(url, this.httpOptions)
  }

  verifPassword(tbObj: any) {
    let url = this.apiUrl + "verifyUserPassword";
    return this.http.post(url, tbObj, this.httpOptions1);
  }

  updatePwd(id: string, pwd: string) {
    let url = this.apiUrl + "udpatePwd/" + id;
    return this.http.post<any>(url, pwd, this.httpOptions1);
  }

}
