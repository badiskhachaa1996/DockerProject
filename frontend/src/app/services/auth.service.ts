import { HttpClient, HttpHeaders ,HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { User } from '../models/User';
import { catchError, map } from 'rxjs/operators';
const io = require("socket.io-client");
import { environment } from 'src/environments/environment';


const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*'}).append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  apiUrl = environment.origin+ "user/"

  socket = io(environment.origin.replace('/soc',''));

  constructor(private http : HttpClient) {  }

  register(user: any) {
    let API_URL = this.apiUrl+"registre";
    user.secret=environment.key
    return this.http.post(API_URL, user)
  }
 
  login(user){
    user.secret=environment.key
    let loginUrl=this.apiUrl+"login";
    return this.http.post<any>(loginUrl,user,httpOptions1);
  }

  getAll(){
    let loginUrl=this.apiUrl+"getAll";
    return this.http.post<any>(loginUrl,{secret:environment.key},httpOptions1);
  }

  getById(id){
    let loginUrl=this.apiUrl+"getById/"+id;
    return this.http.post<any>(loginUrl,{secret:environment.key},httpOptions1);
  }

  update(user :any){
    user.secret=environment.key
    let registreUrl=this.apiUrl+"updateById/"+user._id;
    return this.http.post<any>(registreUrl,user,httpOptions1);

  }
  
  getAllByService(id){
    let loginUrl=this.apiUrl+"getAllbyService/"+id;
    return this.http.post<any>(loginUrl,{secret:environment.key},httpOptions1) 
    ;
  }
  getAllAgent(){
    let loginUrl=this.apiUrl+"getAllAgent/";
    return this.http.post<any>(loginUrl,{secret:environment.key},httpOptions1)
  }
 
  uploadimageprofile(data:FormData){
    let url = this.apiUrl+"file";
    data.append("secret",environment.key)
    return this.http.post<any>(url,data,httpOptions1)
  }

  getProfilePicture(id){
    let url = this.apiUrl+"getProfilePicture/"+id;
    return this.http.post<any>(url,{secret:environment.key},httpOptions1)
  }
  updatePassword(id:string,data){
    let url=this.apiUrl+"updatePassword/"+id;
    data.secret=environment.key
    return this.http.post<any>(url,data,httpOptions1);
  }

  reloadImage(data){
    this.socket.emit("reloadImage",(data))
  }

  AuthMicrosoft(email,name){
    let url=this.apiUrl+"AuthMicrosoft";
    return this.http.post<any>(url,{email,name,secret:environment.key},httpOptions);
  }
 
}
