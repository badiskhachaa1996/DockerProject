import jwt_decode from "jwt-decode";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class LoginGuard implements CanActivate {

    constructor(private router: Router,
        private authService: AuthService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> | boolean {

        if (!localStorage.getItem('token') && !localStorage.getItem('ProspectConected')) {
            return true
        }
        else if (localStorage.getItem('ProspectConected')) {
            this.router.navigate(['/suivre-ma-preinscription']);
            return false
        }
        else {
            console.log("ms token")
            this.router.navigate(['/']);
        }
    }
}
