import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InTime } from '../models/InTime';

@Injectable({
  providedIn: 'root'
})
export class IntimeService {

  apiUrl = `${environment.origin}intime/`;

  constructor(private httpClient: HttpClient) { }


  //Methode de pointage arrivé
  postJustArrived(inTime: InTime)
  {
    let url = `${this.apiUrl}just-arrived`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<InTime>(url, inTime, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => (resolve(response)),
        (error) => (reject(error))
      );
    });
  }

  // methode de check out
  patchCheckOut(check: InTime): Promise<any>
  {
    let url = `${this.apiUrl}patch-check-out`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.patch<any>(url, check, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Check out effectué correctement')
      });
    });
  }


  //methode de recuperation de la liste de présence de tous les utilisateurs
  getAllPopulateUserId()
  {
    let url = `${this.apiUrl}get-all-populate-user-id`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<InTime[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => (resolve(response)),
        (error) => (reject(error))
      );
    });
  }


  //methode de recuperation de la liste de presence de tous les utilisateurs par date
  getAllByDate(dateOfTheDay: Date)
  {
    let url = `${this.apiUrl}get-all-by-date/${dateOfTheDay}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<InTime[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => (resolve(response)),
        (error) => (reject(error))
      );
    });
  }


  //methode de recuperation de la liste de presence de tous les utilisateurs sur interval de date
  getAllByDateBetweenPopulateUserId(beginDate: string, endDate: string)
  {
    let url = `${this.apiUrl}get-all-by-date-between-populate-user-id/${beginDate}/${endDate}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<InTime[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => (resolve(response)),
        (error) => (reject(error))
      );
    });
  }


  //Methode de recuperation de la liste de presence d'un utilisateur via son id
  getAllByUserId(userId: string)
  {
    let url = `${this.apiUrl}get-all-by-user-id/${userId}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<InTime[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => (resolve(response)),
        (error) => (reject(error))
      );
    });
  }


  //Methode de recuperation de la liste de presence d'un utilisateur via son id et sur une plage de date
  getAllByUserIdBetween(userId: string, from: Date, to: Date)
  {
    let url = `${this.apiUrl}get-all-by-userId-between/${userId}/${from}/${to}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<InTime[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => (resolve(response)),
        (error) => (reject(error))
      );
    });
  }


  //Recuperation de la presence d'un utilisateur via une date et un id
  getByDateByUserId(userId: string, dateOfTheDay: string)
  {
    let url = `${this.apiUrl}get-by-date-by-user-id/${userId}/${dateOfTheDay}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get<InTime>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response) => (resolve(response)),
        (error) => (reject(error))
      );
    });
  }

  // methode de modification d'un check
  patchCheck(check: InTime): Promise<any> 
  {
    const url = `${this.apiUrl}/patch-check`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.patch(url, check, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Ckeck mis à jour')
      })
    });
  }


  //Recuperer l'adresse IP de l'utilisateur
  getIpAdress() 
  {
    const url = "https://api.ipify.org?format=json";
    
    return new Promise((resolve, reject) => {
      this.httpClient.get(url).subscribe(
        (response) => (resolve(response)),
        (error) => (reject(error))
      );
    })
  }

}
