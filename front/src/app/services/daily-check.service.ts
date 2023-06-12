import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { DailyCheck } from '../models/DailyCheck';

@Injectable({
  providedIn: 'root'
})
export class DailyCheckService {

  endPoint: string = `${environment.origin}check`;

  constructor(private httpClient: HttpClient) { }

  // recuperation de la liste des présences de tous les utilisateurs
  getChecks(): Promise<DailyCheck[]>
  {
    const url = `${this.endPoint}/get-checks`;

    return new Promise<DailyCheck[]>((resolve, reject) => {
      this.httpClient.get<DailyCheck[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('requête de recuperation de la liste des présences exécuté') }
      });
    });
  }

  // recuperation de la liste des présences d'un utilisateur
  getUserChecks(userId: string): Promise<DailyCheck[]>
  {
    const url = `${this.endPoint}/get-user-checks/${userId}`;

    return new Promise<DailyCheck[]>((resolve, reject) => {
      this.httpClient.get<DailyCheck[]>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('requête de recuperation de la liste des présences de l\'utilisateur exécuté') }
      });
    });
  }

  // recuperation d'une presence via son id
  getCheck(id: string): Promise<DailyCheck>
  {
    const url = `${this.endPoint}/get-check/${id}`;

    return new Promise<DailyCheck>((resolve, reject) => {
      this.httpClient.get<DailyCheck>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('requête de recuperation de la liste des présences de l\'utilisateur exécuté') }
      });
    });
  }

  // recuperation d'une presence via son id
  getCheckByUserId(id: string): Promise<DailyCheck>
  {
    const url = `${this.endPoint}/get-check-by-user-id/${id}`;

    return new Promise<DailyCheck>((resolve, reject) => {
      this.httpClient.get<DailyCheck>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('requête de recuperation de la présences de l\'utilisateur exécuté') }
      });
    });
  }

  // verification du check journalier d'un utilisateur
  verifCheckByUserId(id: string): Promise<DailyCheck>
  {
    const url = `${this.endPoint}/verif-check-by-user-id/${id}`;

    return new Promise<DailyCheck>((resolve, reject) => {
      this.httpClient.get<DailyCheck>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('requête de verification de la présences de l\'utilisateur exécuté') }
      });
    });
  }

  // méthode de check in
  postCheckIn(dailyCheck: DailyCheck): Promise<DailyCheck>
  {
    const url = `${this.endPoint}/post-check-in`;

    return new Promise<DailyCheck>((resolve, reject) => {
      this.httpClient.post<DailyCheck>(url, dailyCheck, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('requête de check in exécuté') }
      });
    });
  }

  // méthode de mise à jour du check
  patchCheckIn(dailyCheck: DailyCheck): Promise<DailyCheck>
  {
    const url = `${this.endPoint}/patch-check-in`;

    return new Promise<DailyCheck>((resolve, reject) => {
      this.httpClient.patch<DailyCheck>(url, dailyCheck, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
        next: (response) => { resolve(response) },
        error: (error) => { reject(error) },
        complete: () => { console.log('requête de mise à jour du check in exécuté') }
      });
    });
  }

}
