import jwt_decode from "jwt-decode";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { EventEmitterService } from '../../services/event-emitter.service';
import { Injectable } from "@angular/core";
import { ServService } from "../../services/service.service";
import { EtudiantService } from "../../services/etudiant.service";

@Injectable({
    providedIn: 'root'
})

export class EtudiantGuardService implements CanActivate {
    constructor(private authService: AuthService,
        private ss: EventEmitterService,
        private router: Router,
        private serv: ServService,
        private etudiantService: EtudiantService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,): Observable<boolean> | Promise<boolean> | boolean {

        let currenttoken: any = jwt_decode(localStorage.getItem("token"))
        let role: string = currenttoken.role;
        let serviceName: string
        if (role == 'Admin') {
            console.log("Accés autorisé: (" + role + ")")
            return true;
        } else {

            return this.etudiantService.getByUser_id(currenttoken.id).pipe(
                map(data => {
                    if (data) {
                        console.log("accés autorisé : étudiant")
                        return true
                    }
                    else {
                        this.router.navigate(['/pages/access']);
                        console.log("accés refusé: page resérvée aux  étudiants")
                        return false
                    }
                }));
        }
    }
}