import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CV } from 'src/app/models/CV';
import { Message } from 'primeng/api';
@Injectable({
  providedIn: 'root'
})
export class CvService {

  apiUrl = environment.origin + "cv/"

  constructor(private http: HttpClient) { }

  uploadCV(data: FormData, user_id: string) {
    let url = this.apiUrl + "uploadCV/" + user_id;
    return this.http.post<any>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  getAll() {
    let url = this.apiUrl + "getAll"
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  create(cv: CV) {
    let url = this.apiUrl + "create"
    return this.http.post<{ cv: CV, message: Message }>(url, cv, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  getSkills() {
    let url = this.apiUrl + "getSkills"
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  getExperiences() {
    let url = this.apiUrl + "getExperiences"
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  getByUserID(user_id: string) {
    let url = this.apiUrl + "getByUserID/" + user_id
    return this.http.get<CV>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
}
