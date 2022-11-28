import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Conge } from '../models/Conge';

@Injectable({
  providedIn: 'root'
})
export class CongeService {

  apiUrl = `${environment.origin}conge`;

  constructor(private httpClient: HttpClient) { }


  //Methode de demande de congés
  postNewHolidays(conge: Conge)
  {
    //Mise en place des dates de debut et de fin
    let beginDate = '';

    for(let i = 0; i < conge.date_debut.length; i++)
    {
      if(conge.date_debut[i] == '/')
      {
        beginDate += '-';
      } else {
        beginDate += conge.date_debut[i];
      }
    }
    conge.date_debut = beginDate;

    let endDate = '';

    for(let i = 0; i < conge.date_fin.length; i++)
    {
      if(conge.date_fin[i] == '/')
      {
        endDate += '-';
      } else {
        endDate += conge.date_fin[i];
      }
    }
    conge.date_fin = endDate;

    const url = `${this.apiUrl}/new-holidays`;

    return new Promise((resolve, reject) => {
      this.httpClient.post<Conge>(url, conge, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error); })
      );
    });
  }


  //Methode de validation de congés
  patchValidateHolidays(conge_id: string)
  {
    const url = `${this.apiUrl}/validate-holidays`;

    return new Promise((resolve, reject) => {
      this.httpClient.patch(url, conge_id, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error); })
      );
    });
  }


  //Methode de réfus de congés
  patchRefuseHolidays(conge_id: string)
  {
    const url = `${this.apiUrl}/refuse-holidays`;

    return new Promise((resolve, reject) => {
      this.httpClient.patch(url, conge_id, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error); })
      );
    });
  }


  //Methode de recuperation des demandes d'un utilisateur entre 2 dates
  getByUserIdBetweenPopulate(user_id: string, begin: Date, end: Date)
  {
    //Mise en place des dates de debut et de fin
    let beginDate = this.onReplaceDate(begin);
    let endDate = this.onReplaceDate(end);    

    const url = `${this.apiUrl}/get-by-user-id-between-populate/${user_id}/${beginDate}/${endDate}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error) })
      );
    });
  }


  //Methode de recuperation des demandes entre 2 dates
  getAllBetweenPopulate(begin: Date, end: Date)
  {
    let beginDate = this.onReplaceDate(begin);
    let endDate = this.onReplaceDate(end);  

    const url = `${this.apiUrl}/get-all-between-populate/${beginDate}/${endDate}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe(
        ((response) => { resolve(response); }),
        ((error) => { reject(error) })
      );
    });
  }


  //Methode de mise en forme des dates
  onReplaceDate(date1: Date)
  {
    let parseDate = date1.toLocaleDateString();

    //Mise en place des dates de debut et de fin
    let newDate = '';

    for(let i = 0; i < parseDate.length; i++)
    {
      if(parseDate[i] == '/')
      {
        newDate += '-';
      } else {
        newDate += parseDate[i];
      }
    }

    return (newDate);
  }

}
