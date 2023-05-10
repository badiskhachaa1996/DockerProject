import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Brand } from '../models/Brand';
import { SupportMarketing } from '../models/SupportMarketing';

@Injectable({
  providedIn: 'root'
})
export class SupportMarketingService {
  apiUrl = environment.origin + "supportMarketing/"
  constructor(private http: HttpClient) { }
  Bcreate(brand: Brand) {
    let url = this.apiUrl + "B/create";
    return this.http.post<Brand>(url, brand, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  BgetByID(id: string) {
    let url = this.apiUrl + "B/getByID/" + id;
    return this.http.get<Brand>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  BgetByPartenaireID(id: string) {
    let url = this.apiUrl + "B/getByPartenaireID/" + id;
    return this.http.get<Brand[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  BgetAll() {
    let url = this.apiUrl + "B/getAll"
    return this.http.get<Brand[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  Bupdate(brand: Brand) {
    let url = this.apiUrl + "B/update"
    return this.http.put<Brand>(url, brand, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  Bdelete(id: string) {
    let url = this.apiUrl + "B/delete/" + id;
    return this.http.delete<Brand>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }

  SMcreate(support_marketing: SupportMarketing) {
    let url = this.apiUrl + "SM/create";
    return this.http.post<SupportMarketing>(url, support_marketing, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  SMupdate(support_marketing: SupportMarketing) {
    let url = this.apiUrl + "SM/update"
    return this.http.put<SupportMarketing>(url, support_marketing, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  SMgetAll() {
    let url = this.apiUrl + "SM/getAll"
    return this.http.get<SupportMarketing[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }


  SMgetAllByBrand(id: string) {
    let url = this.apiUrl + "SM/getAllByBrand/" + id
    return this.http.get<SupportMarketing[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  SMgetByID(id: string) {
    let url = this.apiUrl + "SM/getByID/" + id;
    return this.http.get<SupportMarketing>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  SMdelete(id: string) {
    let url = this.apiUrl + "SM/delete/" + id;
    return this.http.delete<SupportMarketing>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });

  }


  SMupload(formData: FormData) {
    let url = this.apiUrl + "SM/upload"
    return this.http.post<any>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  BuploadLogo(formData: FormData) {
    let url = this.apiUrl + "B/uploadLogo"
    return this.http.post<any>(url, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  BdownloadLogo(id: string) {
    let url = this.apiUrl + "B/downloadLogo/" + id
    return this.http.get<{ file: string, extension: string }>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  BgetAllLogo() {
    let url = this.apiUrl + "B/getAllLogo"
    return this.http.get<{ files: {}, ids: string[] }>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }


  SMdownload(id: string) {
    let url = this.apiUrl + "SM/download/" + id
    return this.http.get<{ file: string, documentType: string }>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }



}
