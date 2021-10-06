import { HttpClient, HttpHeaders ,HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { User } from '../models/User';
import { catchError, map } from 'rxjs/operators';
const io = require("socket.io-client");
import { environment } from 'src/environments/environment';


const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders().append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  apiUrl = environment.origin+ "user/"

  socket = io(environment.origin.replace('soc/',''));

  constructor(private http : HttpClient) {  }

  register(user: User) {
    let API_URL = this.apiUrl+"registre";
    return this.http.post(API_URL, user)
  }
 
  login(user){
    let loginUrl=this.apiUrl+"login";
    return this.http.post<any>(loginUrl,user,httpOptions);
  }

  getAll(){
    let loginUrl=this.apiUrl+"getAll";
    return this.http.get<any>(loginUrl,httpOptions1);
  }

  getById(id){
    let loginUrl=this.apiUrl+"getById/"+id;
    return this.http.get<any>(loginUrl,httpOptions);
  }

  update(user :User){
    let registreUrl=this.apiUrl+"updateById/"+user._id;
    return this.http.post<any>(registreUrl,user,httpOptions);

  }
  
  getAllByService(id){
    let loginUrl=this.apiUrl+"getAllbyService/"+id;
    return this.http.get<any>(loginUrl,httpOptions1) 
    ;
  }
  getAllAgent(){
    let loginUrl=this.apiUrl+"getAllAgent/";
    return this.http.get<any>(loginUrl,httpOptions1)
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
 
  uploadimageprofile(data){
    let url = this.apiUrl+"file";
    return this.http.post<any>(url,data,httpOptions1)
  }

  getProfilePicture(id){
    let url = this.apiUrl+"getProfilePicture/"+id;
    return this.http.get<any>(url,httpOptions1)
  }
  updatePassword(id:string,data){
    let url=this.apiUrl+"updatePassword/"+id;
    return this.http.post<any>(url,data,httpOptions);
  }

  reloadImage(data){
    this.socket.emit("reloadImage",(data))
  }

  AuthMicrosoft(email,name){
    let url=this.apiUrl+"AuthMicrosoft";
    return this.http.post<any>(url,{email,name},httpOptions);
  }
 
}
