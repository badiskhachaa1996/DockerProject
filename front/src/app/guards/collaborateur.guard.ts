import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import jwt_decode from "jwt-decode";
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CollaborateurGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let currenttoken: any = localStorage.getItem("token")

    if (currenttoken) {
      return this.authService.getById(currenttoken.id).pipe(map(user => {
        let data = jwt_decode(user.userToken)['userFromDb']
        if(user.type=="Commercial"){
          return true
        }else{
          return false
        }
      }));
    }
    else {
      console.log("connexion requise")
      this.router.navigate(["/login"])
      return false
    }
  }
}


