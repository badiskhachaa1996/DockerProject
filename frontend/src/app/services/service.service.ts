import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Service } from '../models/Service';
import { Sujet } from '../models/Sujet';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
const httpOptions1 = { headers: new HttpHeaders().append('token', localStorage.getItem('token')) };
@Injectable({
  providedIn: 'root'
})

export class ServService {

  apiUrl ="http://localhost:3000/"

  constructor(private http: HttpClient) { }

  public addService(service: Service) {
    let add_serv = this.apiUrl + "service/addService";
    return this.http.post<any>(add_serv, service, httpOptions) .pipe(
      catchError(this.handleError)
    );
  }

  getAll() {
    let loginUrl = this.apiUrl + "service/getAll";
    return this.http.get<any>(loginUrl, httpOptions);
  }


<<<<<<< HEAD
  update(service :any){
    let registreUrl=this.apiUrl+"service/updateById/"+service.id;
=======
  update(service :Service){
    let registreUrl=this.apiUrl+"service/updateById/"+service._id;
>>>>>>> 5f4c5691f853c590f4664188c65c0c8b967ac685
    return this.http.post<any>(registreUrl,service,httpOptions1);
  }

  delete(id:string){
    let registreUrl=this.apiUrl+"service/deleteById/"+id;
    return this.http.get<any>(registreUrl,httpOptions1);
  }

  getAServiceByid(id:string){
    let registreUrl=this.apiUrl+"service/getById/"+id;
    return this.http.get<any>(registreUrl,httpOptions);
  }

// Error 
handleError(error: HttpErrorResponse) {
  let errorMessage = '';
  if (error.error instanceof ErrorEvent) {
    // Handle client error
    errorMessage = error.error.message;
  } else {
    // Handle server error
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  console.log(errorMessage);
  return throwError(errorMessage);
}
  


  
  

}