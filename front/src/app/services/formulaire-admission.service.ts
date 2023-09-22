import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EcoleAdmission } from '../models/EcoleAdmission';
import { FormationAdmission } from '../models/FormationAdmission';
import { RentreeAdmission } from '../models/RentreeAdmission';
import { TeamsInt } from '../models/TeamsInt';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class FormulaireAdmissionService {

  apiUrl = environment.origin + "formulaireAdmission/";

  constructor(private http: HttpClient) { }

  RAcreate(data: RentreeAdmission) {
    let registerUrl = this.apiUrl + 'RA/create';
    return this.http.post<RentreeAdmission>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  RAupdate(data: RentreeAdmission) {
    let registerUrl = this.apiUrl + 'RA/update';
    return this.http.put<RentreeAdmission>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  RAgetByID(id: string) {
    let registerUrl = this.apiUrl + 'RA/getByID/' + id;
    return this.http.get<RentreeAdmission>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  RAgetByName(nom: string, ecole_id: string) {
    let registerUrl = this.apiUrl + 'RA/getByName/' + name + "/" + ecole_id;
    return this.http.get<RentreeAdmission>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  RAgetByEcoleID(id: string) {
    let registerUrl = this.apiUrl + 'RA/getByEcoleID/' + id;
    return this.http.get<RentreeAdmission[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) })
  }

  RAgetAllByEcoleID(id: string) {
    let registerUrl = this.apiUrl + 'RA/getAllByEcoleID/' + id;
    return this.http.get<RentreeAdmission[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  RAgetAll() {
    let registerUrl = this.apiUrl + 'RA/getAll';
    return this.http.get<RentreeAdmission[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  RAdelete(id: string): Promise<any> 
  {
    const url = `${this.apiUrl}/RA/delete/${id}`

    return new Promise<any>((resolve, reject) => {
      this.http.delete<RentreeAdmission>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('Rentrée scolaire supprimé')
      });
    });
  }  



  FAcreate(data: FormationAdmission) {
    let registerUrl = this.apiUrl + 'FA/create';
    return this.http.post<FormationAdmission>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  FAupdate(data: FormationAdmission) {
    let registerUrl = this.apiUrl + 'FA/update';
    return this.http.put<FormationAdmission>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  FAgetByID(id: string) {
    let registerUrl = this.apiUrl + 'FA/getByID/' + id;
    return this.http.get<FormationAdmission>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  FAgetAll() {
    let registerUrl = this.apiUrl + 'FA/getAll';
    return this.http.get<FormationAdmission[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  FAdelete(_id: string) {
    let registerUrl = this.apiUrl + 'FA/delete/' + _id;
    return this.http.delete<TeamsInt>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }




  EAcreate(data: EcoleAdmission) {
    let registerUrl = this.apiUrl + 'EA/create';
    return this.http.post<EcoleAdmission>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  EAupdate(data: EcoleAdmission) {
    let registerUrl = this.apiUrl + 'EA/update';
    return this.http.put<EcoleAdmission>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  EAgetByID(id: string) {
    let registerUrl = this.apiUrl + 'EA/getByID/' + id;
    return this.http.get<EcoleAdmission>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  EAgetByParams(params: string) {
    let registerUrl = this.apiUrl + 'EA/getByParams/' + params;
    return this.http.get<EcoleAdmission>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) })
  }

  EAgetAll() {
    let registerUrl = this.apiUrl + 'EA/getAll';
    return this.http.get<EcoleAdmission[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  

  EAdelete(id: string): Promise<any> 
  {
    const url = `${this.apiUrl}/EA/delete/${id}`

    return new Promise<any>((resolve, reject) => {
      this.http.delete<EcoleAdmission>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
        complete: () => console.log('École supprimé')
      });
    });
  } 
}


