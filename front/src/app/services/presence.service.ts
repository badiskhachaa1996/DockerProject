import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Presence } from '../models/Presence';


@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;

  apiUrl =environment.origin+ "presence/"

  constructor(private http: HttpClient) { }
  create(data: Presence) {
    let url = this.apiUrl + "create";
    return this.http.post<any>(url, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAll() {
    let loginUrl = this.apiUrl + "getAll";
    return this.http.post<any>(loginUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getById(id:string){
    let registreUrl=this.apiUrl+"getById/"+id;
    return this.http.get<any>(registreUrl,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllByUser(id:string){
    let registreUrl=this.apiUrl+"getAllByUser/"+id;
    return this.http.get<any>(registreUrl,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getAllBySeance(id:string){
    let registreUrl=this.apiUrl+"getAllBySeance/"+id;
    return this.http.get<any>(registreUrl,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  isPresent(id:string){
    let registreUrl=this.apiUrl+"isPresent/"+id;
    return this.http.get<any>(registreUrl,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  addSignature(data){
    let registreUrl=this.apiUrl+"addSignature/"+data._id;
    return this.http.post<any>(registreUrl,data,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  
  addJustificatif(data){
    let registreUrl=this.apiUrl+"addJustificatif/"+data.user_id+"/"+data.seance_id;
    return this.http.post<any>(registreUrl,data,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getSignature(id:string){
    let registreUrl=this.apiUrl+"getSignature/"+id;
    return this.http.get<any>(registreUrl,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  
  getJustificatif(id:string){
    let registreUrl=this.apiUrl+"getJustificatif/"+id;
    return this.http.get<any>(registreUrl,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getPDF(id:string,classe_id:string){
    let registreUrl=this.apiUrl+"getPDF/"+id+"/"+classe_id;
    return this.http.get<any>(registreUrl,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

}
