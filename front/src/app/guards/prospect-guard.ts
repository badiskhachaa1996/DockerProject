import jwt_decode from "jwt-decode";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { EventEmitterService } from '../services/event-emitter.service';
import { Injectable } from "@angular/core";
import { ServService } from "../services/service.service";

@Injectable({
    providedIn: 'root'
})

export class ProspectGuard implements CanActivate {
 
    constructor(private router: Router,
        private serv: ServService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {


        if (localStorage.getItem('ProspectConected')) {

            console.log("Prospect Connecté");
            return true;
           
          }
          else {
            
            console.log("Prospect non authentifier");
            this.router.navigate(['/login']);
            return false;
          }
      

          }
}