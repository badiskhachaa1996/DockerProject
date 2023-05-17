import { Component, OnInit } from '@angular/core';
import jwt_decode from "jwt-decode";
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { saveAs } from "file-saver";
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-dashboard-commercial',
  templateUrl: './dashboard-commercial.component.html',
  styleUrls: ['./dashboard-commercial.component.scss']
})
export class DashboardCommercialComponent implements OnInit {
  token;
  commercial: CommercialPartenaire
  user: User
  imageToShow: any = "../assets/images/avatar.PNG"
  constructor(private CommercialService: CommercialPartenaireService, private UserService: AuthService, private ToastService: MessageService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem("token"))
    this.CommercialService.getByUserId(this.token.id).subscribe(c => {
      if (c) {
        this.commercial = c
        this.UserService.getPopulate(c.user_id).subscribe(u => {
          this.user = u
        })
        this.CommercialService.getProfilePicture(c._id).subscribe((data) => {
          if (data.error) {
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

    })

  }

  downloadContrat() {
    this.CommercialService.downloadContrat(this.commercial._id).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      saveAs(new Blob([byteArray], { type: data.documentType }), data.fileName)
    }, (error) => {
      console.error(error)
      this.ToastService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenu' });
    })
  }

}
