import { Component, Renderer2 } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { io } from 'socket.io-client';
import jwt_decode from "jwt-decode";
import { environment } from 'src/environments/environment';
import { EventEmitterService } from './services/event-emitter.service';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    menuMode = 'static';

    showFooter = true
    title = 'app';
    isAuth = false;
    isStaff = false;
    socket = io(environment.origin.replace('/soc', ''));
    token;
    constructor(private primengConfig: PrimeNGConfig, public renderer: Renderer2, private ss: EventEmitterService, private router: Router, private AuthService: AuthService) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
        
    }


}

