import jwt_decode from "jwt-decode";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from "@angular/core";
import { ServService } from "../../services/service.service";

@Injectable({
  providedIn: 'root'
})

export class ProspectGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean | UrlTree {


    if (localStorage.getItem('ProspectConected')) {

      return true;

    }

    else {

      return this.router.createUrlTree(['/login']);;
    }


  }
}