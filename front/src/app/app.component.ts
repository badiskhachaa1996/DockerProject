import { Component, Renderer2 } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { io } from 'socket.io-client';
import jwt_decode from "jwt-decode";
import { environment } from 'src/environments/environment';
import { EventEmitterService } from './services/event-emitter.service';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    menuMode = 'static';

    showFooter = true
    title = 'app';
    isStaff = false;
    socket = io(environment.origin.replace('/soc', ''));
    token;
    private readonly _destroying$ = new Subject<void>();
    constructor(private primengConfig: PrimeNGConfig, public renderer: Renderer2, private ss: EventEmitterService, private router: Router,
        private msalBroadcastService: MsalBroadcastService, private msalService: MsalService, private AuthService: AuthService) { }

    ngOnInit() {
        this.primengConfig.setTranslation(environment.filterFR)
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';

        this.msalBroadcastService.inProgress$
            .pipe(filter((status: InteractionStatus) => status === InteractionStatus.None)
                , takeUntil(this._destroying$))
            .subscribe(async () => {
                if (this.authenticated) {
                    let response = this.msalService.instance.getActiveAccount()
                    if (response)
                        this.AuthService.AuthMicrosoft(response.username, response.name).subscribe((data) => {
                            localStorage.setItem("token", data.token)
                            console.log(response, data)
                            //this.socket.isAuth()
                            this.router.navigateByUrl('/#/', { skipLocationChange: true }).then(() => {
                                this.ss.connected()
                            });

                        }, (error) => {
                            console.error(error)
                        })
                }
            });

        this.msalBroadcastService.msalSubject$
            .pipe(
                filter(
                    (msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS
                        || msg.eventType === EventType.SSO_SILENT_SUCCESS)
            ).subscribe((result: EventMessage) => {
                const payload = result.payload as AuthenticationResult;
                this.msalService.instance.setActiveAccount(payload.account);
                this.AuthService.AuthMicrosoft(payload.account.username, payload.account.name).subscribe((data) => {
                    localStorage.setItem("token", data.token)
                    //this.socket.isAuth()
                    console.log(payload, data)
                    this.router.navigateByUrl('/#/', { skipLocationChange: true }).then(() => {
                        this.ss.connected()
                    });

                }, (error) => {
                    console.error(error)
                })
            });
    }

    get authenticated(): boolean {
        return this.msalService.instance.getActiveAccount() && this.token ? true : false;
    }

}

