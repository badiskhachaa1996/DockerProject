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

  // recuperation des users pour la cv thèque
  getAllForCV() {
    let url = `${this.apiUrl}get-all-for-cv`;

    return new Promise((resolve, reject) => {
      this.http.get<User[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: User[]) => resolve(response),
        error: (err: any) => console.log(err),
        complete: () => console.log('Tous les utilisateurs de type formateur, Etudiant on étés recupérers')
      });
    });
  }

  // recuperation des salarié pour la partie project
  getAllSalarie(): Promise<User[]> {
    let url = `${this.apiUrl}get-all-salarie`;

    return new Promise<User[]>((resolve, reject) => {
      this.http.get<User[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: User[]) => resolve(response),
        error: (err: any) => reject(err),
        complete: () => console.log('Tous les utilisateurs de type alternant, Salariés et admins on étés recupérers')
      });
    });
  }

  //Recuperation de la liste des utilisateurs en populate sur les services
  getAllPopulate() {
    let url = this.apiUrl + "getAllPopulate";

    return new Promise<User[]>((resolve, reject) => {
      this.http.get<User[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response) }),
        ((error) => { reject(error); })
      );
    });
  }

  getNBUser() {
    let loginUrl = this.apiUrl + "getNBUser";
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
    return this.http.get<User>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  getByEmail(email: string) {
    let registreUrl = this.apiUrl + "getByEmail/" + email;
    return this.http.get<any>(registreUrl, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }
  getByEmailIMS(email: string) {
    let registreUrl = this.apiUrl + "getByEmailIMS/" + email;
    return this.http.get<User>(registreUrl, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  update(user: any) {
    let registreUrl = this.apiUrl + "updateById/" + user._id;
    return this.http.post<User>(registreUrl, { user }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  //Methode de mise à jour des infos d'un utilisateur utilisé sur la page de gestion des utilisateur
  patchById(user: User) {
    let url = `${this.apiUrl}patchById`;

    return new Promise<User>((resolve, reject) => {
      this.http.patch<User>(url, user, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response: User) => { resolve(response); }),
        ((error) => { reject(error); })
      );
    });
  }


  updateByIdForPrivate(user: User) {
    let registreUrl = this.apiUrl + "updateByIdForPrivate/" + user._id;
    return this.http.post<User>(registreUrl, { user }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

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
    return this.http.get<User[]>(loginUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  getAllAgentPopulate() {
    let loginUrl = this.apiUrl + "getAllAgentPopulate";
    return this.http.get<User[]>(loginUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  getAllCommercial() {
    let loginUrl = this.apiUrl + "getAllCommercial/";
    return this.http.get<any>(loginUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  uploadimageprofile(data: FormData) {
    let url = this.apiUrl + "file";
    return this.http.post<any>(url, data)
  }

  deletePDP(user_id: string) {
    let url = this.apiUrl + "deletePDP/" + user_id;
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  getProfilePicture(id) {
    let url = this.apiUrl + "getProfilePicture/" + id;
    return this.http.get<any>(url)
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
    return this.http.post(url, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
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
    return this.http.post<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) })
  }
  reinitPwd(pwdTokenID, pwd) {
    let url = this.apiUrl + "reinitPwd/" + pwdTokenID;
    return this.http.post<any>(url, { pwd }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) })
  }
  getAllCommercialFromTeam(user_id) {
    let url = this.apiUrl + "getAllCommercialFromTeam/" + user_id
    return this.http.get<User[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllCommercialV2() {
    let url = this.apiUrl + "getAllCommercialV2"
    return this.http.get<User[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }


  //Modifier l'utilisateur utilisé sur la page de gestion des utilisateurs
  patchUser(user: User) { }

  //Methode pour recuperer la photo de profil d'un utilisateur methode Idrissa Sall
  getLoadProfilePicture(id: string) {
    let url = `${this.apiUrl}loadProfilePicture/${id}`;

    return new Promise((resolve, reject) => {
      this.http.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error); })
      );
    });
  }
  findDuplicateIMS() {
    let url = this.apiUrl + "findDuplicateIMS"
    return this.http.get<User[][]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  findDuplicatePerso() {
    let url = this.apiUrl + "findDuplicatePerso"
    return this.http.get<User[][]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  delete(user_id) {
    let url = this.apiUrl + "delete/" + user_id
    return this.http.get<User>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  toAdmin() {
    let url = this.apiUrl + "toAdmin"
    return this.http.get<Etudiant[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  toPedagogie() {
    let url = this.apiUrl + "toPedagogie"
    return this.http.get<Etudiant[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  toSupport() {
    let url = this.apiUrl + "toSupport"
    return this.http.get<Etudiant[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  cleanModel() {
    let url = this.apiUrl + "cleanModel"
    return this.http.get<string>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  deleteDuplicateProspect() {
    let url = this.apiUrl + "deleteDuplicateProspect"
    return this.http.get<User[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllWithSameEmail() {
    let url = this.apiUrl + "getAllWithSameEmail"
    return this.http.get<User[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  deleteEmail(user_id: string, type: string) {
    let url = this.apiUrl + "deleteEmail/" + user_id + "/" + type
    return this.http.get<User>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  cleanAllWithSameEmail() {
    let url = this.apiUrl + "cleanAllWithSameEmail"
    return this.http.get<User>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  // méthode d'envoi de mail pour la recuperation du mot de passe externe
  sendRecoveryPasswordEmail(email: string): Promise<any> {
    const url = `${this.apiUrl}send-recovery-password-mail`;

    return new Promise<any>((resolve, reject) => {
      this.http.post<any>(url, { email: email }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) }).subscribe({
        next: (response: any) => { resolve(response); },
        error: (error: any) => { reject(error) },
        complete: () => { console.log('Email envoyé') }
      });
    });
  }


  // méthode de recuperation du mot de passe (modification)
  recoveryPassword(userId: string, password: string): Promise<any> {
    const url = `${this.apiUrl}recovery-password`;

    return new Promise<any>((resolve, reject) => {
      this.http.patch<any>(url, { userId: userId, password: password }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) }).subscribe({
        next: (response: any) => { resolve(response); },
        error: (err: any) => { reject(err) },
        complete: () => { console.log('Mot de passe modifié') }
      });
    });
  }

  create(user: User) {
    let url = `${this.apiUrl}create`;
    return this.http.post<User>(url, user, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByServiceFromList(service_id) {
    let url = `${this.apiUrl}getAllByServiceFromList/${service_id}`;
    return this.http.get<User[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  // méthode de mise à jour du statut de l'utilisateur
  pathUserStatut(statut: string, id: string): Promise<User> {
    const url = `${this.apiUrl}path-user-statut`;

    return new Promise<User>((resolve, reject) => {
      this.http.put(url, { statut: statut, id: id }, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response: User) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('Requête de mise à jour du statut effectué') }
      });
    });
  }

  getAllBySujet(sujet_id) {
    let url = `${this.apiUrl}getAllBySujet/${sujet_id}`;
    return this.http.get<User[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }
  downloadRH(user_id, _id, path) {
    let url = `${this.apiUrl}downloadRH/${_id}/${path}`;
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  uploadRH(data) {
    let url = `${this.apiUrl}uploadRH/`;
    return this.http.post<any>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  nstuget(id) {
    let url = `${this.apiUrl}nstuget/${id}`;
    return this.http.get<{ cv_id, lastname, firstname, email, email_perso, winner_email, winner_lastname, civilite, profile, winner_firstname, winner_id, profilePic }>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllAgentByTicketing(service_id) {
    let url = `${this.apiUrl}getAllAgentByTicketing/${service_id}`;
    return this.http.get<User[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

}
