import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SourceCRM} from "../../models/sourceCRM";

@Injectable({
    providedIn: 'root'
})
export class GestionSourcesServices {

    apiUrl = environment.origin + "gestion-sources";

    constructor(private http: HttpClient) { }

    CreateSource(data: SourceCRM) {
        let registerUrl = this.apiUrl + '/create';
        return this.http.post<SourceCRM>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
    }

    UpdateSource(data: SourceCRM) {
        let registerUrl = this.apiUrl + '/update';
        return this.http.put<SourceCRM>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
    }
    GetSourceByID(id: string) {
        let registerUrl = this.apiUrl + '/getByID/' + id;
        return this.http.get<SourceCRM>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
    }

    GetAllSource() {
        let registerUrl = this.apiUrl + '/getAll';
        return this.http.get<SourceCRM[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
    }

    DeleteSource(id: string) {
        let registerUrl = this.apiUrl + '/delete/' + id;
        return this.http.delete<SourceCRM>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })

    }

}
