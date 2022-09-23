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
import { AdmissionService } from 'src/app/services/admission.service';

@Component({
  selector: 'app-externe',
  templateUrl: './externe.component.html',
  providers: [MessageService],
  styleUrls: ['./externe.component.scss']
})
export class ExterneComponent implements OnInit {

  showLoginPage = false;

  formLogin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  })

  token: any;
  constructor(public AuthService: AuthService, private router: Router, private messageService: MessageService, private ss: EventEmitterService,
    private socket: SocketService, @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private msalService: MsalService, private ProspectService: AdmissionService) { }

  ngOnInit(): void {

  }

  gAfterViewInit() {

    if (localStorage.getItem('errorToken')) {
      let tokenError: { name: string, message: string, expiredAt: number } = JSON.parse(localStorage.getItem('errorToken'))
      //localStorage.removeItem('errorToken')
      if (tokenError.name == 'TokenExpiredError') {
        console.log(tokenError)
        this.messageService.add({ severity: 'error', summary: 'Veuillez vous reconnecter', detail: tokenError.message })
        console.log(tokenError)
      } else {
        this.messageService.add({ severity: 'error', summary: "N'essayer pas d'usurper l'identité de quelqu'un s'il vous plaît", detail: tokenError.message })
      }
    }
  }

  Login() {
    let userToLog = { email: this.formLogin.value.email, password: this.formLogin.value.password };
    this.AuthService.login(userToLog).subscribe((data) => {
      this.socket.isAuth()
      this.ProspectService.getTokenByUserId(jwt_decode(data.token)['id']).subscribe((pData) => {
        if (pData && pData.token) {
          localStorage.setItem('ProspectConected', pData.token)
          this.router.navigate(['/suivre-ma-preinscription'])
        } else {
          localStorage.setItem('token', data.token)
          this.router.navigateByUrl('/#/', { skipLocationChange: true })
        }
      }, error => {
        if (error.status == 404) {
          localStorage.setItem('token', data.token)
          this.router.navigateByUrl('/#/', { skipLocationChange: true })
        } else {
          console.error(error)
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

    this.showLoginPage = false;

  }

  toLoginMiscroft() {

    if (this.msalGuardConfig.authRequest) {
      console.log(this.msalGuardConfig.authRequest)
      this.msalService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          console.log(response)
          this.msalService.instance.setActiveAccount(response.account);
          if (response.account) {
            this.AuthService.AuthMicrosoft(response.account.username, response.account.name).subscribe((data) => {
              localStorage.setItem("token", data.token)
              this.socket.isAuth()
              if (data.message) {
                localStorage.setItem("modify", "true")
                this.router.navigate(['completion-profil'])
              } else {
                this.router.navigateByUrl('/#/', { skipLocationChange: true }).then(() => {
                  this.ss.connected()
                });

              }

            }, (error) => {
              console.error(error)
            })
          } else {
            console.error("ERROR MICROSOFT")
          }
        });
    }
  }


}
