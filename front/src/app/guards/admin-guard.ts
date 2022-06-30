import jwt_decode from "jwt-decode";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { EventEmitterService } from '../services/event-emitter.service';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class AdminGuardService implements CanActivate {
    constructor(private authService: AuthService,
        private ss: EventEmitterService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        let currenttoken: any = jwt_decode(localStorage.getItem("token"))
        let role: string = currenttoken.role;
        if (role == 'Admin') {
            return true;
        } else {
            this.router.navigate(['/pages/access']);

            return false;
        }



    }
}
