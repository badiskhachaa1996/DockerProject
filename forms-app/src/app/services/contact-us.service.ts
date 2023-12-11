import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from "../../environments/environment";
import {LeadCRM} from "../models/LeadCRM";
import {EcoleAdmission} from "../models/EcoleAdmission";

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  apiUrlCreate = environment.origin + "LeadCRM/";
  apiUrl = environment.origin + "formulaireAdmission/";
  constructor(private httpClient: HttpClient) { }

  create(data: LeadCRM) {
    let registreUrl = this.apiUrlCreate + "create";
    return this.httpClient.post<LeadCRM>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }
  EAgetByParams(params: string) {
    let registerUrl = this.apiUrl + 'EA/getByParams/' + params;
    console.log(registerUrl);
    return this.httpClient.get<EcoleAdmission>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) })
  }
}
