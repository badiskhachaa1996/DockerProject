import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { SocketService } from 'src/app/services/socket.service';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { PopupRequest, AuthenticationResult } from '@azure/msal-browser';

@Component({
  selector: 'app-externe',
  templateUrl: './externe.component.html',
  styleUrls: ['./externe.component.scss']
})
export class ExterneComponent implements OnInit {

  formLogin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  })

  token: any;
  constructor(public AuthService: AuthService, private router: Router, private messageService: MessageService, private ss: EventEmitterService, private socket: SocketService,  @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private msalService: MsalService,) { }

  ngOnInit(): void {
   
  }

  Login() {
    let userToLog = { email: this.formLogin.value.email, password: this.formLogin.value.password };
    this.AuthService.login(userToLog).subscribe((data) => {
      localStorage.setItem('token', data.token)
      this.socket.isAuth()
      this.AuthService.WhatTheRole(jwt_decode(data.token)['id']).subscribe((roleConnected) => {
        if (roleConnected.type == "Prospect") {
          localStorage.setItem('ProspectConected', roleConnected.Ptoken)
          this.router.navigate(['/suivre-ma-preinscription'])
        } else{
          this.router.navigateByUrl('/#/', { skipLocationChange: true })
        }

      })
    }, error => {
      if (error.status == 304) {
        this.messageService.add({ severity: 'error', summary: "Activation compte", detail: "Validez votre compte via le mail envoyé dans votre boîte mail" });
      }
      else {
        this.messageService.add({ severity: 'error', summary: "Authentification", detail: "Email ou Mot de passe Incorrect" });
      }

      console.error(error)
    })

  }

  toLoginMiscroft() {
    
    if (this.msalGuardConfig.authRequest) {
      this.msalService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.msalService.instance.setActiveAccount(response.account);
          if (response.account) {
            this.AuthService.AuthMicrosoft(response.account.username, response.account.name).subscribe((data) => {
              localStorage.setItem("token", data.token)
              this.socket.isAuth()
              if (data.message) {
                localStorage.setItem("modify", "true")
                this.router.navigate(['completion-profil'])
              }else{
                this.router.navigateByUrl('/#/', { skipLocationChange: true }).then(() => {
                  this.ss.connected()
                });

              }
              
            },(error)=>{
              console.error(error)
            })
          }else{
            console.error("ERROR MICROSOFT")
          }
        });
    }
  }
  

}
