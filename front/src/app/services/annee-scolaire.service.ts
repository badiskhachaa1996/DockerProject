import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AnneeScolaire } from '../models/AnneeScolaire';
@Injectable({
  providedIn: 'root'
})
export class AnneeScolaireService {

  httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;
  apiUrl =environment.origin+ "anneeScolaire/"
  constructor(private http : HttpClient) { 
  }

  getAll(){
    let anneeScolaireUrl=this.apiUrl+"getAll";
    return this.http.get<any>(anneeScolaireUrl,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  getByID(AnneeScolaireid: any){
    let anneeScolaireUrl=this.apiUrl+"getById/"+AnneeScolaireid;
    return this.http.get<any>(anneeScolaireUrl,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  
  //Recuperer l'année scolaire en cours
  getActive()
  {
    let anneeScolaireUrl = this.apiUrl + "getActive";
    return this.http.get<AnneeScolaire>(anneeScolaireUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  
 create(anneeScolaire: any){
    let anneeScolaireUrl=this.apiUrl+"create";
    return this.http.post<any>(anneeScolaireUrl,anneeScolaire,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  
  edit(AnneeScolaire: any){
    let anneeScolaireUrl=this.apiUrl+"edit"+AnneeScolaire._id;
    return this.http.post<any>(anneeScolaireUrl,AnneeScolaire,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  archivee(AnneeScolaire: any){
    let anneeScolaireUrl=this.apiUrl+"archivee/"+AnneeScolaire;
    return this.http.get<any>(anneeScolaireUrl,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  activer(AnneeScolaire: any){
    let anneeScolaireUrl=this.apiUrl+"activer/"+AnneeScolaire;
    return this.http.get<any>(anneeScolaireUrl,{ headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }



}
