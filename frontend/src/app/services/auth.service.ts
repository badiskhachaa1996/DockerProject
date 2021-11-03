import { HttpClient, HttpHeaders ,HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { User } from '../models/User';
import { catchError, map } from 'rxjs/operators';
const io = require("socket.io-client");
import { environment } from 'src/environments/environment';
import { Inscription } from '../models/Inscription';


const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json','Access-Control-Allow-Origin':'*',"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders({'Access-Control-Allow-Origin':'*',"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"}).append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  apiUrl = environment.origin+ "user/"

  socket = io(environment.origin.replace('/soc',''));

  constructor(private http : HttpClient) {  }

  register(user: any) {
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
    return this.http.get<any>(loginUrl,httpOptions1);
  }

  update(user :User,inscription:Inscription){
    let registreUrl=this.apiUrl+"updateById/"+user._id;
    return this.http.post<any>(registreUrl,{user,inscription},httpOptions1);

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
 
  uploadimageprofile(data:FormData){
    let url = this.apiUrl+"file";
    return this.http.post<any>(url,data,httpOptions1)
  }

  getProfilePicture(id){
    let url = this.apiUrl+"getProfilePicture/"+id;
    return this.http.get<any>(url,httpOptions1)
  }
  updatePassword(id:string,data){
    let url=this.apiUrl+"updatePassword/"+id;
    return this.http.post<any>(url,data,httpOptions1);
  }

  reloadImage(data){
    this.socket.emit("reloadImage",(data))
  }

  AuthMicrosoft(email,name){
    let url=this.apiUrl+"AuthMicrosoft";
    return this.http.post<any>(url,{email,name},httpOptions);
  }
 
}
