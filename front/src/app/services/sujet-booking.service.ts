import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SujetBooking } from '../models/SujetBooking';

@Injectable({
  providedIn: 'root'
})
export class SujetBookingService {

  apiUrl = `${environment.origin}sujet-booking`;

  constructor(private httpClient: HttpClient) { }


  // create a new sujet
  create(sujetBooking: SujetBooking): Promise<any> 
  {
    const url = `${this.apiUrl}/create`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post<SujetBooking>(url, sujetBooking, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Sujet Booking crée')
      });
    });
  }

  // update sujet
  put(sujetBooking: SujetBooking): Promise<any> 
  {
    const url = `${this.apiUrl}/update-sujet-booking`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.put<SujetBooking>(url, sujetBooking, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Sujet modifié')
      });
    });
  }

  // delete sujet
  deleteSujet(id: string): Promise<any> 
  {
    const url = `${this.apiUrl}/delete-sujet-booking/${id}`

    return new Promise<any>((resolve, reject) => {
      this.httpClient.delete<SujetBooking>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Sujet supprimé')
      });
    });
  }
  // get all sujet
  getSujets(): Promise<SujetBooking[]>
  {
    const url = `${this.apiUrl}/get-sujets`;


    return new Promise<SujetBooking[]>((resolve, reject) => {
      this.httpClient.get<SujetBooking[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Sujets récuperés')
      });
    });
  }

  //Désactiver un sujet
  hideSujet(id: string) {
    const url = `${this.apiUrl}/hide-sujet-booking/`+ id;
    
    return this.httpClient.get<SujetBooking>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Activer un sujet
  showSujet(id: string) {
    const url = `${this.apiUrl}/show-sujet-booking/`+ id;
    return this.httpClient.get<SujetBooking>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
