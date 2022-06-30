import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inscription } from '../models/Inscription';

const httpOptions1 = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' })/*.append('token', localStorage.getItem('token'))*/ };


@Injectable({
  providedIn: 'root'
})
export class FirstInscriptionService {
  
  apiUrl = environment.origin +"inscription/"

  constructor(private httpClient: HttpClient) { }

  getAll()
  {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<Inscription[]>(registreUrl, httpOptions1);
  }
  getById(id: string)
  {
    let registreUrl = this.apiUrl + "getById/" + id;
    return this.httpClient.get<Inscription>(registreUrl, httpOptions1);
  }
  getByUser(id: string)
  {
   
    let registreUrl = this.apiUrl + "getByUserId/" + id;
    return this.httpClient.get<Inscription>(registreUrl, httpOptions1);
  }
  getByEmail(email: string)
  {
    let registreUrl = this.apiUrl + "getByEmail/" +email;
    return this.httpClient.get<Inscription>(registreUrl, httpOptions1);
  }
  create(objNewInscri:any)
  {
    let registreUrl = this.apiUrl + "firstInscription";
    return this.httpClient.post<any>(registreUrl, objNewInscri, httpOptions1);
  }
  updateStatutById(inscription: Inscription,email_perso:string)
  {
    let registreUrl = this.apiUrl + "editStatutById/" + inscription._id;
  return this.httpClient.post<Inscription>(registreUrl, [inscription,email_perso], httpOptions1);
  }

  uploadFile(data: FormData,id_preins){
    let url = this.apiUrl+"uploadFile/"+id_preins;
    return this.httpClient.post<any>(url,data,httpOptions1)
  }


  getFiles(id:string){
    let registreUrl = this.apiUrl +"getFilesInscri/"+id;
    return this.httpClient.get<any>(registreUrl,httpOptions1)

  }
  downloadFile(id,filename:string){
    console.log("filename: ",filename)
    let registreUrl=this.apiUrl+"downloadFile/"+id+"/"+filename;
    return this.httpClient.post<any>(registreUrl,filename,httpOptions1);
  }

  deletepreinscription(id){
    let registreUrl=this.apiUrl+"deleteById/"+id;
    return this.httpClient.get<any>(registreUrl,httpOptions1);
  }

  getAllByCode(code){
    let registreUrl=this.apiUrl+"getAllByCode/"+code;
    return this.httpClient.get<any>(registreUrl,httpOptions1);
  }


}
