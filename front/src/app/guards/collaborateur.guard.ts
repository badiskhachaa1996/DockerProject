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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    let currenttoken: any = localStorage.getItem("token")

    if (currenttoken) {
      currenttoken = jwt_decode(localStorage.getItem("token"))
      let role: string = currenttoken.role;
      let type: string = currenttoken.type;
      let service_id = currenttoken.service_id;
      if (type != "Commercial") {

        console.log("accés refusé | Not Commercial");
        return false
      }
      else if (type == "Commercial") {

        console.log("acces autorisé  | Commercial")
        return true

        // this.authService.getById(currenttoken.id).pipe(map(data => {
        //   console.log(data)
        //   type = data.type
        //   console.log(type)
        //   if (type = "Commercial") {
        //     console.log("Partenaire autorisé")
        //     result == true;
        //   }
        //   else {
        //     console.log("Acces refusé")
        //     result == false
        //   }
        // }))
      }
    }
    else {
      console.log("connexion requise")
      this.router.navigate(["/login"])
      return false
    }
  }
}


