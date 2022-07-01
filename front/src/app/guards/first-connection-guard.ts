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

export class FirstConnectionGuard implements CanActivate {
    constructor(private authService: AuthService,
        private ss: EventEmitterService,
        private router: Router,
        private serv: ServService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,): boolean {

        let currenttoken: any = jwt_decode(localStorage.getItem("token"))
        let role: string = currenttoken.role;
        let serviceName: string
        if (role == 'Admin') {
            return true;
        } else if (role == 'Responsable' || role == 'Agent') {

            console.log(currenttoken.service_id)
            this.serv.getAServiceByid(currenttoken.service_id).subscribe(
                (data) => {
                    serviceName = data.dataService.label
                    console.log(data.dataService.label)
                    if (serviceName.includes("Admission")) {
                        console.log("accés autorisé: " + role)
                    }
                    else {
                        console.log("accés refusé: page resérvé membres du service Admission")
                    }
                })

            //this.router.navigateByUrl('/pages/access');
        }
        else {
            console.log("accés refusé: page resérvé au staff")
            this.router.navigate(['/pages/access']);
            return false
        }
    }
}