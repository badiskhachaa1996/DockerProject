import { HttpClient, HttpHeaders ,HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { User } from '../models/User';
import { catchError, map } from 'rxjs/operators';



const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders().append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  apiUrl ="http://localhost:3000/"
  private Services = [];

  constructor(private http : HttpClient) {  }

 /* register(user :User){
    let registreUrl=this.apiUrl+"user/registre";
    return this.http.post<any>(registreUrl,user,httpOptions);
  }*/
  register(user: User) {
    let API_URL = this.apiUrl+"user/registre";
    return this.http.post(API_URL, user)
      .pipe(
        catchError(this.handleError)
      )
  }
 
  login(user){
    let loginUrl=this.apiUrl+"user/login";
    return this.http.post<any>(loginUrl,user,httpOptions) .pipe(
      catchError(this.handleError)
    );
  }

  getAll(){
    let loginUrl=this.apiUrl+"user/getAll";
    return this.http.get<any>(loginUrl,httpOptions1) .pipe(
      catchError(this.handleError)
    );
  }

  getById(id){
    let loginUrl=this.apiUrl+"user/getById/"+id;
    return this.http.get<any>(loginUrl,httpOptions) .pipe(
      catchError(this.handleError)
    );
  }

  update(user :User){
    let registreUrl=this.apiUrl+"user/updateById/"+user._id;
    return this.http.post<any>(registreUrl,user,httpOptions1);

  }
  getAllByService(id){
    let loginUrl=this.apiUrl+"user/getAllbyService/"+id;
    return this.http.get<any>(loginUrl,httpOptions1) .pipe(
      catchError(this.handleError)
    );
  }
  // createServices(service){
  //   const newService = { id: Date.now(), ...service};
  //   this.Services = [service, ...this.Services] ;
  //   console.log(this.Services);
  //    }

  //    getServices(){
  //      return this.Services;
  //    }
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
