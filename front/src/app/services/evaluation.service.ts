import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Evaluation } from '../models/evaluation';
@Injectable({
    providedIn: 'root'
})
export class EvaluationService {

    apiUrl = `${environment.origin}evaluation`;

    constructor(private httpClient: HttpClient) { }
    // create a new project
    postEvaluation(evaluation: Evaluation): Promise<any> {


        const url = `${this.apiUrl}/create-evaluation`;

        return new Promise<any>((resolve, reject) => {
            this.httpClient.post<Evaluation>(url, evaluation, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
                next: (response) => resolve(response),
                error: (error) => reject(error),
                complete: () => console.log('Projet crée')
            });
        });
    }
    async getevaluations(): Promise<Evaluation[]> {
        const response = await this.httpClient.get<Evaluation[]>(`${this.apiUrl}/recuperation`, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).toPromise();
        return response || [];
    }

    delete(id: string): Promise<any> {
        const url = `${this.apiUrl}/delete/${id}`

        return new Promise<any>((resolve, reject) => {
            this.httpClient.delete<Evaluation>(url, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
                next: (response) => resolve(response),
                error: (error) => reject(error),
                complete: () => console.log('Project supprimé')
            });
        });
    }
    putEvaluation(evaluation: Evaluation): Promise<any> {
        const url = `${this.apiUrl}/put-evaluation`;

        return new Promise<any>((resolve, reject) => {
            this.httpClient.put<Evaluation>(url, evaluation, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) }).subscribe({
                next: (response) => resolve(response),
                error: (error) => reject(error),
                complete: () => console.log('evaluation modifié')
            });
        });
    }


}
