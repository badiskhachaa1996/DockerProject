import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormulaireServiceService {

  apiUrl = environment.origin + "template/formulaire/"
  constructor(private httpClient: HttpClient) { }

  create(data: any) {
    let registreUrl = this.apiUrl + "create";
    return this.httpClient.post<any>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  update(data: any) {
    let registreUrl = this.apiUrl + "update";
    return this.httpClient.put<any>(registreUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }
  delete(id: string) {
    let registreUrl = this.apiUrl + "delete/" + id;
    return this.httpClient.delete<any>(registreUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) });
  }

  exempleGETEcole() {
    return [
      { _id: "CD2", name: "STUDINFO", details: "Ecole Informatique" },
      { _id: "EF3", name: "ESPIC", details: "Ecole Commercial" },
      { _id: "GH4", name: "ICBS", details: "Ecole Incroyable" },
    ]
  }

  exempleGETFormation() {
    return new Promise<[{ _id: string, name: string, details: string, ecole_id: string }]>(() => {
      return [
        { _id: "12A", name: "BTS SIO", ecole_id: "CD2", details: "Services informatiques aux organisations" },
        { _id: "34B", name: "Master Expert IT Big Data", ecole_id: "CD2", details: "J'adore les donnés" },
        { _id: "56C", name: "Master Expert IT CyberSécurité", ecole_id: "CD2", details: "J'adore le réseau" },
        { _id: "78D", name: "BTS MCO", ecole_id: "EF3", details: "Management Commercial Opérationnel" },
        { _id: "90E", name: "BTS NDRC", ecole_id: "EF3", details: "Négociation et Digitalisation de la Relation Client" },
        { _id: "90E", name: "CGM", ecole_id: "GH4", details: "Chargé de gestion management" },
        { _id: "12F", name: "BTS SPSSS", ecole_id: "GH4", details: "Services et prestations des secteurs sanitaire et social" },
        { _id: "34G", name: "BIM", ecole_id: "GH4", details: "Modeleur du Bâtiment" },
      ]
    })
  }

  exempleGETFormationByEcoleID(id) {
    let liste = [
      { _id: "12A", name: "BTS SIO", ecole_id: "CD2", details: "Services informatiques aux organisations" },
      { _id: "34B", name: "Master Expert IT Big Data", ecole_id: "CD2", details: "J'adore les donnés" },
      { _id: "56C", name: "Master Expert IT CyberSécurité", ecole_id: "CD2", details: "J'adore le réseau" },
      { _id: "78D", name: "BTS MCO", ecole_id: "EF3", details: "Management Commercial Opérationnel" },
      { _id: "90E", name: "BTS NDRC", ecole_id: "EF3", details: "Négociation et Digitalisation de la Relation Client" },
      { _id: "90E", name: "CGM", ecole_id: "GH4", details: "Chargé de gestion management" },
      { _id: "12F", name: "BTS SPSSS", ecole_id: "GH4", details: "Services et prestations des secteurs sanitaire et social" },
      { _id: "34G", name: "BIM", ecole_id: "GH4", details: "Modeleur du Bâtiment" },
    ]
    let r = []
    liste.forEach(v => {
      if (v.ecole_id == id)
        r.push(v)
    })
    return r
  }

}
