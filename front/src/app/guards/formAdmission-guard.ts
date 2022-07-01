import jwt_decode from "jwt-decode";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class FormAdmissionGuard implements CanActivate {

    constructor(private router: Router,
        private authService: AuthService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> | boolean | UrlTree {

        if (route.params.ecole.toLowerCase() =="espic" || route.params.ecole.toLowerCase() == "estya" || route.params.ecole.toLowerCase() == "eduhorizons" || route.params.ecole.toLowerCase() == "adg") {
            return true
        }
        else{
          return this.router.createUrlTree(['/pages/access']) ;
          
            
             
        }
    }
}
