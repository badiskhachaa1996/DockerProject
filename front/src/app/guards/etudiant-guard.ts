import jwt_decode from "jwt-decode";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { EventEmitterService } from '../services/event-emitter.service';
import { Injectable } from "@angular/core";
import { ServService } from "../services/service.service";
import { EtudiantService } from "../services/etudiant.service";

@Injectable({
    providedIn: 'root'
})

export class EtudiantGuardService implements CanActivate {
    constructor(private authService: AuthService,
        private ss: EventEmitterService,
        private router: Router,
        private serv: ServService,
        private etudiantService: EtudiantService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,): boolean {

        let currenttoken: any = jwt_decode(localStorage.getItem("token"))
        let role: string = currenttoken.role;
        let serviceName: string
        if (role == 'Admin') {
            console.log(currenttoken)
            console.log("accés autorisé:"+ role)
            return true;
        } else {
            console.log(currenttoken)
            this.etudiantService.getByUser_id(currenttoken.id).subscribe((data) => {
                console.log(data)
                if (data) {
                    console.log("accés autorisé : étudiant")

                    return true
                }
                else {
                    this.router.navigate(['/pages/access']);
                    console.log("accés refusé: page resérvée aux  étudiants")
                    return false
                }

            })

            
        }


        //this.router.navigateByUrl('/pages/access');

    }
}