import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FactureFormateur } from 'src/app/models/FactureFormateur';
import { FactureFormateurMensuel } from 'src/app/models/FactureFormateurMensuel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormateurFactureService {

  apiUrl = environment.origin + "factureFormateur/";

  constructor(private http: HttpClient) { }
  //Création d'un nouveau prospect
  create(tbObj: FactureFormateur) {
    let registerUrl = this.apiUrl + 'create';
    return this.http.post<FactureFormateur>(registerUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  createMensuel(tbObj: FactureFormateurMensuel) {
    let registerUrl = this.apiUrl + 'createMensuel';
    return this.http.post<FactureFormateurMensuel>(registerUrl, tbObj, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  upload(formData: FormData) {
    let registerUrl = this.apiUrl + "uploadFile/" + formData.get('_id')
    return this.http.post<{}>(registerUrl, formData, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  download(formateur_id, _id) {
    let registerUrl = this.apiUrl + "download/" + formateur_id + "/" + _id
    return this.http.get<{ file, documentType, fileName }>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  downloadMensuel(formateur_id, mois) {
    let registerUrl = this.apiUrl + "downloadMensuel/" + formateur_id + "/" + mois.toString()
    return this.http.get<{ file, documentType, fileName }>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }

  getAll() {
    let registerUrl = this.apiUrl + 'getAll';
    return this.http.get<FactureFormateur[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
  getAllMensuel() {
    let registerUrl = this.apiUrl + 'getAllMensuel';
    return this.http.get<FactureFormateur[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
  }
}
