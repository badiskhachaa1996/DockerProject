import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, catchError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { EventEmitterService } from '../../services/event-emitter.service';
import { MessageService } from 'primeng/api';



@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    /*
  showFooter = true
  isAuth = false;
     isStaff = false;
 socket = io(environment.origin.replace('/soc', ''));
     token;
  constructor(private authService: AuthService,
    private ss: EventEmitterService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    this.socket.on("isAuth", (data) => {
      this.isAuth = data
      if (data) {
          this.token = jwt_decode(localStorage.getItem("token"))
          this.isStaff = this.token.role != "user"
      }
  })
  if (window.location.pathname.startsWith("/demande-admission") == false) {

      if (window.location.pathname.startsWith("/validation-email") == false && window.location.pathname != "/suivre-ma-preinscription" && window.location.pathname != "/login-externe" && window.location.pathname != "/partenaireInscription" && window.location.pathname != "/suivre-ma-preinscription") {
          
          if (localStorage.getItem("token") != null && (!localStorage.getItem("modify") || localStorage.getItem("modify") == null)) {
           
              this.isAuth = true;
              this.token = jwt_decode(localStorage.getItem("token"))
              this.isStaff = this.token.role != "user"
               console.log(this.token)
               return true
          }
          else if (this.router.url != "/login-externe") {

              this.router.navigate(['/login'])
            return false
          }
          this.ss.getEmittedValue()
              .subscribe(ITEM => {
                  this.isAuth = ITEM
                  if (ITEM) {
                      this.token = jwt_decode(localStorage.getItem("token"))
                      this.isStaff = this.token.role != "user"
                  }
              });
      }
  } else {
      if (window.location.pathname != ("/demande-admission/estya")) {
          this.showFooter = false
      }
  }
  if (window.location.pathname != "/suivre-ma-preinscription") {
      let token = jwt_decode(localStorage.getItem("token"))
      this.authService.WhatTheRole(token['id']).subscribe(data => {
          if (data.type == "Prospect") {
              this.router.navigate(['/suivre-ma-preinscription'])
          }
      })
  }
   
   */
    constructor(private authService: AuthService, private messageService: MessageService,
        private ss: EventEmitterService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        let currenttoken: any = localStorage.getItem("token");

        if (currenttoken) {
            currenttoken = jwt_decode(localStorage.getItem("token"))
            if (!localStorage.getItem('token') && !localStorage.getItem('ProspectConected')) {
                this.router.navigate(['/login']);
                return false
            }
            else if (localStorage.getItem('ProspectConected')) {
                this.router.navigate(['/suivre-ma-preinscription']);
                return false
            }
            else {
                return this.authService.HowIsIt(currenttoken.id).pipe(
                    map(stateOfUser => {
                        if (stateOfUser.type != "Externe-InProgress") {
                            if (stateOfUser.name == 'Profil complet' || state.url == "/completion-profil") {
                                return true
                            }
                            else if (stateOfUser.name == "Profil incomplet") {
                                this.router.navigate(['/completion-profil']);
                            } else if (stateOfUser.name == "JsonWebTokenError" || stateOfUser.name == "TokenExpiredError") {
                                localStorage.setItem('errorToken', JSON.stringify(stateOfUser))
                                localStorage.removeItem('token')
                                this.router.navigate(['/login']);
                            }
                            else {
                                this.router.navigate(['/login']);
                            }
                        }else{
                            this.router.navigate(['/formulaire-externe']);
                        }

                    }),
                    catchError(err => {
                        localStorage.removeItem('token')
                        this.router.navigate(['/login']);
                        throw err;
                    }))
            }
        }
        else {
            this.router.navigate(['/login']);
        }
    }
}
