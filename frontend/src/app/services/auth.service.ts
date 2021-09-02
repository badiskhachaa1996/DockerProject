import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';

const httpOptions={​​​​​​​​ headers : new HttpHeaders({​​​​​​​​'Content-Type' : 'application/json'}​​​​​​​​)}​​​​​​​​;
const httpOptions1={​​​​​​​​ headers :new HttpHeaders().append('token', localStorage.getItem('token')) }​​​​​​​​;

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  apiUrl ="http://localhost:3000/"
  private Services = [];

  constructor(private http : HttpClient) {  }

  register(user :User){
    let registreUrl=this.apiUrl+"user/registre";
    return this.http.post<any>(registreUrl,user,httpOptions);
  }
  login(user){
    let loginUrl=this.apiUrl+"user/login";
    return this.http.post<any>(loginUrl,user,httpOptions);
  }

  getAll(){
    let loginUrl=this.apiUrl+"user/getAll";
    return this.http.get<any>(loginUrl,httpOptions1);
  }

  getById(id){
    let loginUrl=this.apiUrl+"user/getById/"+id;
    return this.http.get<any>(loginUrl,httpOptions1);
  }

<<<<<<< HEAD
  update(user :any){
    let registreUrl=this.apiUrl+"user/updateById/"+user.id;
=======
  update(user :User){
    let registreUrl=this.apiUrl+"user/updateById/"+user._id;
>>>>>>> 5f4c5691f853c590f4664188c65c0c8b967ac685
    return this.http.post<any>(registreUrl,user,httpOptions1);
  }
  getAllByService(id){
    let loginUrl=this.apiUrl+"user/getAllbyService/"+id;
    return this.http.get<any>(loginUrl,httpOptions1);
  }
  // createServices(service){
  //   const newService = { id: Date.now(), ...service};
  //   this.Services = [service, ...this.Services] ;
  //   console.log(this.Services);
  //    }

  //    getServices(){
  //      return this.Services;
  //    }
}
