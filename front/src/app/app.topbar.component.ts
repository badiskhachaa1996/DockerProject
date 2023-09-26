import { Component, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { Notification } from './models/notification';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
import jwt_decode from "jwt-decode";
import { ServService } from './services/service.service';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from './services/auth.service';
import { User } from './models/User';
import { CommonModule } from '@angular/common';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { OnInit } from '@angular/core';



const io = require("socket.io-client");

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',

})
export class AppTopBarComponent implements OnInit {
  items: MenuItem[] | undefined;

  logo = "assets/images/logo-ims-new.png"
  notif = false;
  Notifications = 0;
  socket = io(environment.origin.replace('/soc', ''));
  isCEO = false
  userConnected: User;
  token: any;
  user = true;
  nom = ""
  statutUser = "Disponible";
  prenom = "";
  today: Date = new Date();
  imageToShow: any = "../assets/images/avatar.PNG";

  constructor(public appMain: AppMainComponent, private CService: CommercialPartenaireService, private serv: ServService, private router: Router,
    private NotificationService: NotificationService, private msalService: MsalService,
    private AuthService: AuthService, private ToastService: MessageService, private UserService: AuthService, private messageService: MessageService,) { }

  //Methode de deconnexion
  onDisconnect() {
    localStorage.removeItem('token');
    this.msalService.logoutRedirect();
    this.router.navigate(['login']);
  }
  setToZero() {

    this.Notifications = 0

  }
  onGetUserConnectedInformation(): void {
    this.UserService.getPopulate(this.token.id).subscribe({
      next: (response) => {
        this.userConnected = response;
        this.nom = this.userConnected.lastname;
        this.prenom = this.userConnected.firstname
        this.statutUser=this.userConnected.statut;
      }
    })
  }
  reader: FileReader = new FileReader();
  loadPP(rowData) {
    console.log(rowData)
    this.imageToShow = "../assets/images/avatar.PNG"
    console.log(rowData)
    this.CService.getProfilePicture(rowData._id).subscribe((data) => {
      if (data.error) {
        console.error(data.error)
        this.imageToShow = "../assets/images/avatar.PNG"
      } else {
        const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
        let blob: Blob = new Blob([byteArray], { type: data.documentType })
        let reader: FileReader = new FileReader();
        reader.addEventListener("load", () => {
          this.imageToShow = reader.result;
        }, false);
        if (blob) {
          this.imageToShow = "../assets/images/avatar.PNG"
          reader.readAsDataURL(blob);
        }
      }

    })
  }
  // méthode de mise à jour du statut
  onUpdateStatus(statut): void {
    this.UserService.pathUserStatut(statut, this.userConnected._id)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Statut', detail: 'Votre statut à bien été mis à jour' });
        this.onGetUserConnectedInformation();
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Statut', detail: 'Impossible de mettre à jour votre statut' }); });
  }

  ngOnInit() {

    this.token = jwt_decode(localStorage.getItem('token'));
    this.reader.addEventListener("load", () => {
      this.imageToShow = this.reader.result;
    }, false);
    this.UserService.getProfilePicture(this.token.id).subscribe((data) => {
      if (data.error) {
        this.imageToShow = "../assets/images/avatar.PNG"
      } else {
        const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
        let blob: Blob = new Blob([byteArray], { type: data.documentType })
        if (blob) {
          this.imageToShow = "../assets/images/avatar.PNG"
          this.reader.readAsDataURL(blob);
        }
      }
    })
    let temp: any = jwt_decode(localStorage.getItem("token"))
    let url = window.location.href;
    //console.log(url)

    this.onGetUserConnectedInformation();
    if (url.includes('ims.adgeducation')) //ims.adgeducation
      this.logo = "assets/images/logo_adg.png"
    if (temp.service_id) {
      this.serv.getAServiceByid(temp.service_id).subscribe(service => {
        let serviceName = service.dataService.label
        if (serviceName.includes("Admission")) {
          this.NotificationService.getAdmissionNotifi().subscribe(notifAdmission => {
            if (notifAdmission.length != 0) {
              this.Notifications = notifAdmission.length
            }
            else {
              console.log("aucune notif admission trouvé")
            }
          })

        }
        else {
          // recupérer les notifs des autres services
        }

      }
      )
    }

    this.NotificationService.getAllByUserId(temp.id).subscribe((data) => {
      this.Notifications = data.length;
      if (data.length != 0) {
        this.notif = true;
      }



    }, error => {
      console.error(error)
    })
    this.socket.on("NewNotif", (data) => {
      this.Notifications += 1
      this.notif = true;
    })
    this.socket.on("NewNotifV2", (data) => {
      this.Notifications += 1
      this.notif = true;
      this.ToastService.add({ severity: 'info', summary: "Vous avez reçu une nouvelle notification", detail: data })
    })
    this.socket.on("reloadNotif", () => {
      this.NotificationService.getAllByUserId(temp.id).subscribe((data) => {
        this.Notifications = data.length;
        this.notif = data.length != 0;

      }, error => {
        console.error(error)
      })
    })
    this.AuthService.getById(temp.id).subscribe((data) => {
      let userconnected = jwt_decode(data.userToken)["userFromDb"];
      this.isCEO = userconnected.type == "CEO Entreprise";
      if (userconnected) {
        this.socket.emit("userLog", jwt_decode(data.userToken)["userFromDb"])
      }
    }, (error) => {
      console.error(error)
    })
    this.items = [
      {
        label: "Disponible",
        items: [
          {
            label: 'Disponible',
            command: () => {
              this.onUpdateStatus('Disponible');
            }
          },
          {
            label: 'Absent',
            command: () => {
              this.onUpdateStatus('Absent');
            }
          },
          {
            label: 'En pause',
            command: () => {
              this.onUpdateStatus('En pause');

            }

          },
          {
            label: 'Occupé',
            command: () => {
              this.onUpdateStatus('Occupé');

            }

          },
          {
            label: 'En congé',
            command: () => {
              this.onUpdateStatus('En congé');

            }

          },
          {
            label: 'En réunion',
            command: () => {
              this.onUpdateStatus('En réunion');

            }

          },
        ]
        ,

      },
      {
        label: 'Profil',
        icon: 'pi pi-fw pi-user',
        routerLink: '/profil'

      },

      {
        label: 'Déconnexion',
        command: () => {
          this.onDisconnect();

        }
      }
    ];
  }
}