import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';

import jwt_decode from "jwt-decode";

import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { EventEmitterService } from '../services/event-emitter.service';


@Injectable({
  providedIn: 'root'
})

export class CompletionProfilGuard implements CanActivate {
  constructor(private authService: AuthService, private messageService: MessageService,
    private ss: EventEmitterService,
    private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let currenttoken: any = localStorage.getItem("token");

    if (currenttoken) {
      currenttoken = jwt_decode(localStorage.getItem("token"))
      if (!localStorage.getItem('token') && !localStorage.getItem('ProspectConected')) {
        this.router.navigate(['/login']);
        return false
      }
      return this.authService.HowIsIt(currenttoken.id).pipe(
        map(stateOfUser => {
          if (stateOfUser.name == 'Profil complet') {
            console.log(stateOfUser.name)
            return false
          }
          else if (stateOfUser.name == "Profil incomplet") {
            console.log(stateOfUser.name)
            return true
          }
        }))
    }
  }
}


