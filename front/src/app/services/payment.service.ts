import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IndividualAccount } from '../models/lemonway/IndividualAccount';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  apiUrl = environment.origin + "lemon/";
  lemonApiUrl = "https://sandbox-api.lemonway.fr/mb/eduhorizons/dev/directkitrest/v2/";

  lemonHeaders = new HttpHeaders({ 
                                  'Access-Control-Allow-Origin': '*', 
                                  'Authorization': 'f3b0723d-9739-467b-8cb5-5c8855fc1e66',
                                  'PSU-IP-Address': '130.180.213.198',
                                });

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


  //Ajouter un nouveau compte dans notre base de données
  postIndividualAccount(account: IndividualAccount)
  {
    const url = this.apiUrl + 'postIndividualAccount';

    return new Promise((resolve, reject) => {
      this.httpClient.post<IndividualAccount>(url, account, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error); })
      );
    });
  }


  //Ajouter un nouveau compte individuel
  postIndividualAccountLemon(account: IndividualAccount)
  {
    const lemonUrl = this.lemonApiUrl + "accounts/individual";

    return new Promise((resolve, reject) => {
      this.httpClient.post<IndividualAccount>(lemonUrl, account, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', 'Authorization': 'Bearer f3b0723d-9739-467b-8cb5-5c8855fc1e66', 'PSU-IP-Address': '130.180.213.198', 'Content-Type': 'application/json' }) }).subscribe(
        ((response) => { resolve(response); }),
        ((err) => { reject(err); })
      );
    });
  }

  
}
