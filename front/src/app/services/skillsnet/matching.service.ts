import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CV } from 'src/app/models/CV';
import { Evenements } from 'src/app/models/Evenements';
import { Matching } from 'src/app/models/Matching';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchingService {

  apiUrl = environment.origin + "matching/";
  constructor(private httpClient: HttpClient) { }
  create(tbObj: any) {
    let url = this.apiUrl + 'create';
    return this.httpClient.post<Matching>(url, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  update(id: string, obj: any) {
    let url = this.apiUrl + 'update/' + id;
    return this.httpClient.put<Matching>(url, obj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  delete(id:string){
    let url = this.apiUrl + 'delete/' + id;
    return this.httpClient.delete<Matching>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
      
  }

  getByID(id: string) {
    let url = this.apiUrl + 'getByID/' + id;
    return this.httpClient.get<Matching>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAll() {
    let url = this.apiUrl + 'getAll';
    return this.httpClient.get<Matching[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  generateMatchingV1(offre_id: string) {
    let url = this.apiUrl + 'generateMatchingV1/' + offre_id;
    return this.httpClient.get<{ cv: CV, taux: number }[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  generateMatchingV1USERID(user_id: string) {
    let url = this.apiUrl + 'generateMatchingV1USERID/' + user_id;
    return this.httpClient.get<Matching[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllByOffreID(offre_id:string) {
    let url = this.apiUrl + 'getAllByOffreID/' + offre_id;
    return this.httpClient.get<Matching[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  getAllByCVUSERID(user_id:string) {
    let url = this.apiUrl + 'getAllByCVUSERID/' + user_id;
    return this.httpClient.get<Matching[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
