import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IndividualAccount } from '../models/lemonway/IndividualAccount';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  apiUrl = environment.origin + "paiements/"

  constructor(private httpClient: HttpClient) { }

  //Recupération de la liste des comptes bancaires
  getAllAccounts()
  {
    const url = this.apiUrl + 'getAllAccounts';

    return new Promise((resolve, reject) => {
      this.httpClient.get<IndividualAccount[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response) }),
        ((error) => { reject(error); })
      );
    });

  }
}
