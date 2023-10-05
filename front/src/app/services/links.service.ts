import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Links } from 'src/app/models/Links';
@Injectable({
  providedIn: 'root'
})
export class LinksService {
  apiUrl = `${environment.origin}links`;

  constructor(private httpClient: HttpClient) { }

  postLinks(links: Links): Promise<any> {
    console.log(links);
    const url = `${this.apiUrl}/create-links`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.post<Links>(url, links, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('links crée')
      });
    });
  }
  //recuperation des projects

  async getAllLinks(): Promise<Links[]> {
    const response = await this.httpClient.get<Links[]>(`${this.apiUrl}/getalllinks`, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).toPromise();
    return response || [];
  }

  //RECUPERATION D4UN lien PAR ID
  getLinks(id: string): Promise<Links> {
    const url = `${this.apiUrl}/get-links/${id}`;

    return new Promise<Links>((resolve, reject) => {
      this.httpClient.get<Links>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Links récuperé')
      });
    });
  }

  // update links
  putLinks(links: Links): Promise<any> {
    const url = `${this.apiUrl}/put-links`;

    return new Promise<any>((resolve, reject) => {
      this.httpClient.put<Links>(url, links, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('links modifié')
      });
    });
  }

}