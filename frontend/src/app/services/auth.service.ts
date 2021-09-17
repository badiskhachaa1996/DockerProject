import { HttpClient, HttpHeaders ,HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { User } from '../models/User';
import { catchError, map } from 'rxjs/operators';
const io = require("socket.io-client");


const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders().append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  apiUrl ="http://localhost:3000/user/"
  private Services = [];

  socket = io("http://localhost:3000");

  constructor(private http : HttpClient) {  }

  register(user: User) {
    let API_URL = this.apiUrl+"registre";
    return this.http.post(API_URL, user)
      .pipe(
        catchError(this.handleError)
      )
  }
 
  sendemail(user) {
    console.log(user)
    let API_URL = this.apiUrl+"sendemail";
    return this.http.post(API_URL, user)
      .pipe(
        catchError(this.handleError)
      )
  }
 
  login(user){
    let loginUrl=this.apiUrl+"login";
    return this.http.post<any>(loginUrl,user,httpOptions) .pipe(
      catchError(this.handleError)
    );
  }

  getAll(){
    let loginUrl=this.apiUrl+"getAll";
    return this.http.get<any>(loginUrl,httpOptions1) .pipe(
      catchError(this.handleError)
    );
  }

  getById(id){
    let loginUrl=this.apiUrl+"getById/"+id;
    return this.http.get<any>(loginUrl,httpOptions) .pipe(
      catchError(this.handleError)
    );
  }

  update(user :User){
    let registreUrl=this.apiUrl+"updateById/"+user._id;
    return this.http.post<any>(registreUrl,user,httpOptions);

  }
  
  getAllByService(id){
    let loginUrl=this.apiUrl+"getAllbyService/"+id;
    return this.http.get<any>(loginUrl,httpOptions1) .pipe(
      catchError(this.handleError)
    );
  }
  getAllAgent(){
    let loginUrl=this.apiUrl+"getAllAgent/";
    return this.http.get<any>(loginUrl,httpOptions1) .pipe(
      catchError(this.handleError)
    );
  }
 
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
 
  sendEmail(url,data){
    return this.http.post(url,data)
  }
 
  uploadimageprofile(file:File,Userid:any,filetype:any){

  }
  updatePassword(id:string,password:string){
    let url=this.apiUrl+"updatePassword/"+id;
    return this.http.post<any>(url,{password},httpOptions);
  }
 
}
