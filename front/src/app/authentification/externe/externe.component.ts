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
import { MpOublieComponent } from '../mp-oublie/mp-oublie.component';

@Component({
  selector: 'app-externe',
  templateUrl: './externe.component.html',
  providers: [MessageService],
  styleUrls: ['./externe.component.scss']
})
export class ExterneComponent implements OnInit {
  logo = "assets/images/logo-ims-new.png"
  showLoginPage = false;

  formLogin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  })

  token: any;
  constructor(public AuthService: AuthService, private router: Router, private messageService: MessageService, private ss: EventEmitterService,
    private socket: SocketService, @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService, private ProspectService: AdmissionService) { }

  ngOnInit(): void {
    let url = window.location.href;
    //console.log(url)
    if (url.includes('ims.adgeducation')) //ims.adgeducation
      this.logo = "assets/images/logo_adg.png"
  }

/*ngAfterViewInit() {

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
    console.log(this.msalService.instance)
    if (this.msalService.instance.getActiveAccount()) {
      let response = this.msalService.instance.getActiveAccount()
      if (response)
        this.AuthService.AuthMicrosoft(response.username, response.name).subscribe((data) => {
          console.log(response, data)
          localStorage.setItem("token", data.token)
          this.socket.isAuth()
          this.router.navigateByUrl('/#/', { skipLocationChange: true }).then(() => {
            this.ss.connected()
          });
        }, (error) => {
          console.error(error)
        })
    }
  }*/

  Login() {
    let userToLog = { email: this.formLogin.value.email, password: this.formLogin.value.password };
    this.AuthService.login(userToLog).subscribe((data) => {
      this.socket.isAuth()
      localStorage.setItem('token', data.token)
      this.AuthService.getPopulate(jwt_decode(data.token)['id']).subscribe(user => {
        if (user?.type == "Externe-InProgress") {
          this.router.navigateByUrl('/formulaire-externe', { skipLocationChange: true })
        } else {
          this.ProspectService.getTokenByUserId(jwt_decode(data.token)['id']).subscribe((pData) => {
            this.router.navigateByUrl('/#/', { skipLocationChange: true })
          })
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
    localStorage.clear()
    this.msalService.instance.setActiveAccount(null)
    this.msalService.instance.loginRedirect({
      scopes: ['user.read'],
    });
  }

}
