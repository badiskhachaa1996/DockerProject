import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {ProduitCRM} from "../../models/produitCRM";

@Injectable({
    providedIn: 'root'
})
export class GestionProduitsService {

    ProduitTest = [
    {id: 1, name: 'Produit 1', description: 'Description 1'},
    {id: 2, name: 'Produit 2', description: 'Description 2'},
    {id: 3, name: 'Produit 3', description: 'Description 3'},
    {id: 4, name: 'Produit 4', description: 'Description 4'}
    ];

    apiUrl = environment.origin + "gestion-produits";

    constructor(private http: HttpClient) { }

    CreateProdut(data: ProduitCRM) {
        let registerUrl = this.apiUrl + '/create';
        return this.http.post<ProduitCRM>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
    }

    UpdateProduit(data: ProduitCRM) {
        let registerUrl = this.apiUrl + '/update';
        return this.http.put<ProduitCRM>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
    }
    GetProduitByID(id: string) {
        let registerUrl = this.apiUrl + '/getByID/' + id;
        return this.http.get<ProduitCRM>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
    }

    GetAllProduit() {
        let registerUrl = this.apiUrl + '/getAll';
        return this.http.get<ProduitCRM[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
    }

    DeleteProduit(id: string) {
        let registerUrl = this.apiUrl + '/delete/' + id;
        return this.http.delete<ProduitCRM>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })

    }

}
