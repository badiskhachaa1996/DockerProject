import jwt_decode from "jwt-decode";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { EventEmitterService } from '../services/event-emitter.service';
import { Injectable } from "@angular/core";
import { ServService } from "../services/service.service";

@Injectable({
  providedIn: 'root'
})

export class AdministrationGuardService implements CanActivate {
  constructor(private authService: AuthService,
    private ss: EventEmitterService,
    private router: Router,
    private serv: ServService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let currenttoken: any = jwt_decode(localStorage.getItem("token"))

    let role: string = currenttoken.role;
    let serviceName: string

    if (role == 'Admin') {
      console.log("Accés autorisé")
      return true;
    }
    else {

      return this.serv.getAServiceByid(currenttoken.service_id).pipe(
        map(service => {
          serviceName = service.dataService.label
          if (serviceName.includes("Administration")) {
            console.log("Accés autorisé: (" + role + ")")
            return true
          }
          else {
            console.log("Accés refusé: page resérvé membres du service Administration")
            this.router.navigate(['/pages/access']);
            return false;
          }
        }))
    }

  }
}



