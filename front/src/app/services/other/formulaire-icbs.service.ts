import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActualiteInt } from 'src/app/models/ActualiteInt';
import { FormulaireICBS } from 'src/app/models/FormulaireICBS';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormulaireIcbsService {
  apiUrl = environment.origin + "formulaireICBS/"
  constructor(private httpClient: HttpClient) { }

  create(data: FormulaireICBS) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<FormulaireICBS>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  delete(id: string) {
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.httpClient.delete<FormulaireICBS>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }

  getAll() {
    let registreUrl = this.apiUrl + "getAll";
    return this.httpClient.get<FormulaireICBS[]>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }) });
  }
}
