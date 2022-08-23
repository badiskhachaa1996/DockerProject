import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import jwt_decode from "jwt-decode";
@Injectable({
  providedIn: 'root'
})
export class CeoEntrepriseGuard implements CanActivate {
  constructor(private authService: AuthService,
    private router: Router,) { }
  canActivate(

    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let currenttoken: any = jwt_decode(localStorage.getItem("token"))
    let type: string = currenttoken.type;
    if (currenttoken.role == "Admin")
      return true
    else if (type == 'CEO Entreprise') {
      console.log("accés autorisé")
      return true;
    }
    else {
      console.log("accés refusé: page resérvé au CEO d'entreprises")
      this.router.navigate(['/pages/access']);
      return false
    }

  }
}


