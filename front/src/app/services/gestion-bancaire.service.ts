import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GestionBancaireService {

  //headers options
  // authorization = "Bearer f3b0723d-9739-467b-8cb5-5c8855fc1e66";
  // accept = "*/*";
  // psuIpAddress = "130.180.213.198";
  // token = "f3b0723d-9739-467b-8cb5-5c8855fc1e66";

  options = {
    Authorization: 'Bearer f3b0723d-9739-467b-8cb5-5c8855fc1e66',
    token: "f3b0723d-9739-467b-8cb5-5c8855fc1e66",
    'PSU-IP-Address': '130.180.213.198',
  };

  endPoint = 'https://sandbox-api.lemonway.fr/mb/eduhorizons/dev/directkitrest/v2/';

  constructor(private httpClient: HttpClient) { }

  /** Methode en Post */



  /** end */

  /** Methode en Get */

  //Recucperer la liste des comptes 
  getAllAccounts()
  {
    let url = this.endPoint + 'accounts/123456789212345';

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, { headers: new HttpHeaders(this.options) }).subscribe(
        (response) => { resolve(response); },
        (error) => { reject(error);}
      );
    });
  }

  /** end */

  /** Methode en Put */

  /** end */

  /** Methode en Delete */

  /** end */
}
