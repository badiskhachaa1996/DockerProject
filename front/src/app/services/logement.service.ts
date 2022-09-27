import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Reservation } from '../models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class LogementService {

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };

  apiUrl = environment.origin + "logement/"

  constructor(private httpClient: HttpClient) { }

  //Créer une nouvelle réservation
  createReservation(reservation: Reservation)
  {
    let url = this.apiUrl + 'newReservation';
    return this.httpClient.post<any>(url, reservation, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //recuperation de toute les reservation
  getAllReservation()
  {
    let url = this.apiUrl + 'getAllReservation';
    return this.httpClient.get<Reservation[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //recuperation de toute les reservations en attentes
  getAllReservationWaiting()
  {
    let url = this.apiUrl + 'getAllReservationWaiting';
    return this.httpClient.get<Reservation[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //recuperation de toute les reservations validées
  getAllReservationsValidated()
  {
    let url = this.apiUrl + 'getAllReservationsValidated';
    return this.httpClient.get<Reservation[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //valider une reservation
  validateReservation(reservation: Reservation)
  {
    let url = this.apiUrl + 'validateReservation/' + reservation._id;
    return this.httpClient.put<any>(url, reservation, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //supprimer une reservation
  deleteReservation(id: string)
  {
    let url = this.apiUrl + 'deleteReservation/' + id;
    return this.httpClient.delete<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  //Verifier l'existence d'une reservation
  verifyReservation(user_id: string)
  {
    let url = this.apiUrl + 'verifyReservation/' + user_id;

    return new Promise((resolve, reject) => {
      this.httpClient.get<Reservation>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        (response: Reservation) => { resolve(response); },
        (error) => { reject(error); }
      );
    });
  }

}
