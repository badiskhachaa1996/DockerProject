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
export class TuteurEntrepriseGuard implements CanActivate {
  constructor(private authService: AuthService,
    private router: Router,) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let currenttoken: any = jwt_decode(localStorage.getItem("token"))
    let type: string = currenttoken.type;


    if (type == 'Tuteur' || "CEO Entreprise") {
      console.log("accés autorisé")
      return true;
    }
    else {


      console.log("accés refusé: page resérvé au Tuteur d'alternants")
      this.router.navigate(['/pages/access']);
      return false
    }

  }
}


