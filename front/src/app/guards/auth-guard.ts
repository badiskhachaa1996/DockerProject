import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { EventEmitterService } from '../services/event-emitter.service';



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
    constructor(private authService: AuthService,
        private ss: EventEmitterService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        let currenttoken: any = localStorage.getItem("token");

        if (currenttoken) {
            currenttoken = jwt_decode(localStorage.getItem("token"))
            console.log(currenttoken)



            if (!localStorage.getItem('token') && !localStorage.getItem('ProspectConected')) {
                console.log("Login")
                this.router.navigate(['/login']);
                return false
            }
            else if (localStorage.getItem('ProspectConected')) {
                console.log("Prospect token")
                this.router.navigate(['/suivre-ma-preinscription']);
                return false
            }
            else {

                return this.authService.getById(currenttoken.id).pipe(
                    map(userdata => {
                        let UserTok: any = jwt_decode(userdata.userToken)
                        console.log(UserTok.userFromDb)

                        if (UserTok.userFromDb.civilite || state.url == "/completion-profil") {
                            console.log("accés autorisé: ")
                            return true
                        }

                        else {
                            console.log("Completer votre profil avant de continuer la navigation")
                            this.router.navigate(['/completion-profil']);

                            return true
                        }
                    }))

            }
        }
        else {
            this.router.navigate(['/login']);
        }
    }
}
