import jwt_decode from "jwt-decode";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

        if (route.params.ecole.toLowerCase() == "intuns" || route.params.ecole.toLowerCase() == "espic" ||
            route.params.ecole.toLowerCase() == "estya" || route.params.ecole.toLowerCase() == "eduhorizons" ||
            route.params.ecole.toLowerCase() == "adg" || route.params.ecole.toLowerCase() == "studinfo" ||
            route.params.ecole.toLowerCase() == "intunivesity" || route.params.ecole.toLowerCase() == "estya-dubai" ||
            route.params.ecole.toLowerCase() == "icbsmalte" || route.params.ecole.toLowerCase() == "medasup" || route.params.ecole.toLowerCase() == "btech" ||
            route.params.ecole.toLowerCase() == "inteducation") {
            return true
        }
        else {
            return this.router.createUrlTree(['/pages/access']);



        }
    }
}
