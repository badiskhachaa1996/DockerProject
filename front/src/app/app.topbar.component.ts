import { Component, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
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
import { EtudiantService } from './services/etudiant.service';



const io = require("socket.io-client");

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',

})
export class AppTopBarComponent implements OnInit {
  items: MenuItem[] | undefined;
  menuCalenders: MenuItem[] | undefined;
  logo = "assets/images/logo-ims-new.png"
  notif = false;
  Notifications = 0;
  socket = io(environment.origin.replace('/soc', ''));
  isCEO = false
  isEtudiant = false
  isExterne = false
  isAgent = false
  isProspect = false
  isAdmin = false
  isReinscrit = false
  seeCRA = false
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
    private AuthService: AuthService, private ToastService: MessageService, private UserService: AuthService, private messageService: MessageService,
    private EtuService: EtudiantService) { }

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
        this.statutUser = this.userConnected.statut;
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
    this.userConnected.statut = statut
    this.items[0].label = statut
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
        let serviceName = service?.dataService?.label
        if (serviceName && serviceName.includes("Admission")) {
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
      let userconnected: User = jwt_decode(data.userToken)["userFromDb"];
      this.isAgent = (userconnected.role == 'Agent' && userconnected.type != 'Commercial') || userconnected.role == 'Responsable'
      this.isAdmin = userconnected.role == 'Admin'
      this.isProspect = userconnected.type == 'Prospect'
      this.isCEO = userconnected.type == "CEO Entreprise";
      this.isEtudiant = (userconnected.type == "Intial" || userconnected.type == "Alternant");
      this.seeCRA = (this.isAdmin || this.isAgent)
      if (userconnected.haveNewAccess) {
        this.seeCRA = (userconnected.type == 'Collaborateur' || userconnected.type == 'Responsable' || userconnected.type_supp.includes('Responsable') || userconnected.type == 'Formateur' || userconnected.type_supp.includes('Formateur') || userconnected.type_supp.includes('Collaborateur'))
      }
      this.EtuService.getPopulateByUserid(this.token.id).subscribe(dataEtu => {
        this.isReinscrit = (dataEtu && dataEtu.classe_id == null)
      })

      this.isExterne = userconnected?.type?.includes('Externe')

      this.items = [
        {
          label: this.userConnected?.statut || "Disponible",
          items: [
            {
              label: 'Disponible',
              icon: 'pi pi-check-circle',
              command: () => {
                this.onUpdateStatus('Disponible');
              }
            },
            {
              label: 'Absent',
              icon: 'pi pi-times-circle',
              command: () => {
                this.onUpdateStatus('Absent');
              }
            },
            {
              label: 'En pause',
              icon: 'pi pi-stop-circle',
              command: () => {
                this.onUpdateStatus('En pause');

              }

            },
            {
              label: 'Occupé',
              icon: 'pi pi-minus-circle',
              command: () => {
                this.onUpdateStatus('Occupé');

              }

            },
            {
              label: 'En congé',
              icon: 'pi pi-arrow-circle-right',
              command: () => {
                this.onUpdateStatus('En congé');

              }

            },
            {
              label: 'En réunion',
              icon: 'pi pi-circle-fill',
              command: () => {
                this.onUpdateStatus('En réunion');

              }

            }, {
              label: 'Ecole',
              icon: 'pi pi-book',
              command: () => {
                this.onUpdateStatus('Ecole');

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
          icon: 'pi pi-power-off',
          command: () => {
            this.onDisconnect();

          }
        }
      ];
      if (userconnected) {
        this.socket.emit("userLog", jwt_decode(data.userToken)["userFromDb"])
      }
    }, (error) => {
      console.error(error)
    })
    this.menuCalenders = [
      {
        label: "CRA",
        command: () => {
          this.router.navigate(['/'], { queryParams: { param: 1 } });
        }
      },
      {
        label: "Calendrier",
        command: () => {
          this.router.navigate(['/'], { queryParams: { param: 2 } });
        }
      },
      {
        label: "Historique",
        command: () => {
          this.router.navigate(['/'], { queryParams: { param: 3 } });
        }
      },
      {
        label: "Congé",
        command: () => {
          this.router.navigate(['/'], { queryParams: { param: 4 } });
        }
      },
      {
        label: "Assiduité",
        command: () => {
          this.router.navigate(['/'], { queryParams: { param: 5 } });
        }

      },
    ];
  }

  onLeftMouseClick(event: MouseEvent, contextMenu: ContextMenu): void {
    event.stopPropagation();
    event.preventDefault();
    contextMenu.show(event);
  }
  onLeftMouseClickC(event: MouseEvent, contextMenu: ContextMenu): void {
    event.stopPropagation();
    event.preventDefault();
    contextMenu.show(event);
  }
}