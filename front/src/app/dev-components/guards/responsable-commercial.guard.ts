import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import jwt_decode from "jwt-decode";
import { ServService } from '../../services/service.service';
import { truncate } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class ResponsableCommercialGuard implements CanActivate {
  constructor(
    private serv: ServService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let currenttoken: any = jwt_decode(localStorage.getItem("token"))
    let role: string = currenttoken.role;
    if (role == "Admin")
      return true
    else
      return this.serv.getAServiceByid(currenttoken.service_id).pipe(
        map(service => {
          if (service.dataService.label.includes("ommercial") && role == "Responsable") {
            console.log("accés autorisé: " + role)
            return true
          }
          else {
            console.log("accés refusé: page resérvé aux responsable commercial")
            this.router.navigate(['/pages/access']);
            return false
          }
        }))
  }

}
