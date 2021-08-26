import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SujetService {

  constructor(private http: HttpClient) { }
  apiUrl ="http://localhost:3000/"
  getAll(){
    let loginUrl=this.apiUrl+"sujet/getAll";
    return this.http.get<any>(loginUrl);
  }
}
