import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' })/*.append('token', localStorage.getItem('token'))*/ };

@Injectable({
  providedIn: 'root'
})
export class EtatPreinscriptionServiceService {
  apiUrl = environment.origin +"etatpreinscription"
  constructor(private httpClient: HttpClient) { }

  uploadFile(id_preins,data: FormData){
    let url = this.apiUrl+"uploadFile/"+id_preins;
    return this.httpClient.post<any>(url,data,httpOptions1)
  }
}
