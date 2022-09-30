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
  getAllAccounts() {
    const url = this.apiUrl + 'getAllAccounts';

    return new Promise((resolve, reject) => {
      this.httpClient.get<IndividualAccount[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response) }),
        ((error) => { reject(error); })
      );
    });
  }

  getAllAccountsv2() {
    const url = "https://sandbox-api.lemonway.fr/mb/eduhorizons/dev/directkitrest/v2/accounts/123456789212345";
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ "accept": "application/json", "content-type": "application/json", "psu-ip-address": "130.180.213.198", "Authorization": "Bearer f3b0723d-9739-467b-8cb5-5c8855fc1e66" }) });
  }
}
