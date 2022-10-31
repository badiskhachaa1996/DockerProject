import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DemandeConseiller } from 'src/app/models/DemandeConseiller';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DemandeConseillerService {

  apiUrl = environment.origin + "demande_conseiller/";

  constructor(private httpClient: HttpClient) {
  }

  create(tbObj: DemandeConseiller) {
    let registerUrl = this.apiUrl + 'create';
    return this.httpClient.post<DemandeConseiller>(registerUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  findbyStudentID(id) {
    let registerUrl = this.apiUrl + 'findbyStudentID/' + id;
    return this.httpClient.get<DemandeConseiller>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  getAll() {
    let registerUrl = this.apiUrl + 'getAll';
    return this.httpClient.get<DemandeConseiller[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  Update(tbObj: DemandeConseiller) {
    let registerUrl = this.apiUrl + 'Update/' + tbObj._id;
    return this.httpClient.post<DemandeConseiller>(registerUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  delete(id: string) {
    let registerUrl = this.apiUrl + 'delete/' + id;
    return this.httpClient.post<any>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
}
