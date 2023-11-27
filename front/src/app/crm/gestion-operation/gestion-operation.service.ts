import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {OperationCRM} from "../../models/operationCRM";

@Injectable({
    providedIn: 'root'
})
export class GestionOperationService {

    apiUrl = environment.origin + "gestion-operation";

    constructor(private http: HttpClient) { }

    CreateOperation(data: OperationCRM) {
        let registerUrl = this.apiUrl + '/create';
        return this.http.post<OperationCRM>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
    }

    UpdateOperation(data: OperationCRM) {
        let registerUrl = this.apiUrl + '/update';
        return this.http.put<OperationCRM>(registerUrl, data, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
    }
    GetOperationByID(id: string) {
        let registerUrl = this.apiUrl + '/getByID/' + id;
        return this.http.get<OperationCRM>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
    }

    GetAllOperation() {
        let registerUrl = this.apiUrl + '/getAll';
        return this.http.get<OperationCRM[]>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })
    }

    DeleteOperation(id: string) {
        let registerUrl = this.apiUrl + '/delete/' + id;
        return this.http.delete<OperationCRM>(registerUrl, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }).append('token', localStorage.getItem('token')) })

    }

}
