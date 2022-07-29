import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class contactService {
  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' })/*.append('token', localStorage.getItem('token'))*/ };

  apiUrl = environment.origin + "contact/"

  constructor(private httpClient: HttpClient) { }

  sendEmail(data) {
    let registreUrl = this.apiUrl + "sendMail"

    return this.httpClient.post<any>(registreUrl, data);
  }

}