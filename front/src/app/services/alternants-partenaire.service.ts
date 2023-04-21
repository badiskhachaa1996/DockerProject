import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlternantsPartenaire } from '../models/AlternantsPartenaire';

@Injectable({
  providedIn: 'root'
})
export class AlternantsPartenaireService {

  httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem('token')) };
  apiUrl = environment.origin + "alternantsPartenaire/"
  constructor(private http: HttpClient) {
  }


  create(data: AlternantsPartenaire) {
    let registerUrl = this.apiUrl + 'create';
    return this.http.post<AlternantsPartenaire>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  update(data: AlternantsPartenaire) {
    let registerUrl = this.apiUrl + 'update';
    return this.http.put<AlternantsPartenaire>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  getByID(id: string) {
    let registerUrl = this.apiUrl + 'getByID' + id;
    return this.http.get<AlternantsPartenaire>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  getAll() {
    let registerUrl = this.apiUrl + 'getAll';
    return this.http.get<AlternantsPartenaire[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  getAllByCommercialUserID(id) {
    let registerUrl = this.apiUrl + 'getAllByCommercialUserID/' + id;
    return this.http.get<AlternantsPartenaire[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  downloadFile(id, directory = "requis", path) {
    let url = this.apiUrl + "downloadFile/" + id + "/" + directory + "/" + path
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }


  deleteOptioFile(id, filename) {
    let url = this.apiUrl + "deleteOptioFile/" + id + "/" + filename
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  deleteRequisFile(id, filename) {
    let url = this.apiUrl + "deleteOptioFile/" + id + "/" + filename
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  uploadRequisFile(formData) {
    let url = this.apiUrl + "uploadRequisFile"
    return this.http.post<AlternantsPartenaire>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem("token")) });
  }

  uploadOptionnelFile(formData) {
    let url = this.apiUrl + "uploadOptionnelFile"
    return this.http.post<AlternantsPartenaire>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' }).append('token', localStorage.getItem("token")) });
  }

}
