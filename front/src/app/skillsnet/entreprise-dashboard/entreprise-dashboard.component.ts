import { Component, OnInit } from '@angular/core';
import { Entreprise } from 'src/app/models/Entreprise';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import jwt_decode from "jwt-decode";
import { TuteurService } from 'src/app/services/tuteur.service';
import { Tuteur } from 'src/app/models/Tuteur';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-entreprise-dashboard',
  templateUrl: './entreprise-dashboard.component.html',
  styleUrls: ['./entreprise-dashboard.component.scss']
})
export class EntrepriseDashboardComponent implements OnInit {
  modeEdit = false
  imgSrc: any = "assets/images/avatar.PNG"
  USER: User
  ENTREPRISE: Entreprise
  token;
  reader: FileReader = new FileReader();
  secteurs = [
    { label: 'Industrie manufacturière', value: 'Industrie manufacturière' },
    { label: "Technologie de l'information et de la communication", value: "Technologie de l'information et de la communication" },
    { label: "Finance et services bancaires", value: "Finance et services bancaires" },
    { label: "Commerce de détail", value: "Commerce de détail" },
    { label: "Énergie", value: "Énergie" },
    { label: "Santé et pharmaceutique", value: "Santé et pharmaceutique" },
    { label: "Transport et logistique", value: "Transport et logistique" },
    { label: "Tourisme et hôtellerie", value: "Tourisme et hôtellerie" },
    { label: "Construction et immobilier", value: "Construction et immobilier" },
    { label: "Éducation", value: "Éducation" },
    { label: "Industrie automobile", value: "Industrie automobile" },
    { label: "Aérospatiale et défense", value: "Aérospatiale et défense" },
    { label: "Médias et divertissement", value: "Médias et divertissement" },
    { label: "Environnement et développement durable", value: "Environnement et développement durable" },
    { label: "Chimie", value: "Chimie" },
    { label: "Artisanat et design", value: "Artisanat et design" },
    { label: "Télécommunications", value: "Télécommunications" },
    { label: "Services professionnels", value: "Services professionnels" },
    { label: "Services publics", value: "Services publics" }

  ]
  categorieList = [
    'Sous-traitant',
    "Alternant",
    "Prestataire",
    "Autre"
  ]
  constructor(private UserService: AuthService, private entrepriseService: EntrepriseService, private ToastService: MessageService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem("token"));
    this.reader.addEventListener("load", () => {
      this.imgSrc = this.reader.result;
    }, false);
    this.UserService.getPopulate(this.token.id).subscribe(r => {
      this.USER = r
    })
    this.entrepriseService.getByDirecteurId(this.token.id).subscribe(r2 => {
      this.ENTREPRISE = r2
      this.entrepriseService.getLogo(r2._id).subscribe(logo => {
        if (logo.error) {
          this.imgSrc = "../assets/images/avatar.PNG"
        } else {
          const byteArray = new Uint8Array(atob(logo.file).split('').map(char => char.charCodeAt(0)));
          let blob: Blob = new Blob([byteArray], { type: logo.documentType })
          if (blob) {
            this.imgSrc = "../assets/images/avatar.PNG"
            this.reader.readAsDataURL(blob);
          }
        }
      })
    })
  }

  onEdit() {
    this.modeEdit = true
  }

  onSave() {
    this.UserService.update({ ...this.USER }).subscribe(r => {

    })
    this.entrepriseService.update({ ...this.ENTREPRISE }).subscribe(r => {
      this.modeEdit = false
    })

  }

  updateImg() {
    document.getElementById('selectedFile').click();
  }

  FileUpload(event) {
    if (event && event.length > 0) {
      const formData = new FormData();
      formData.append('id', this.ENTREPRISE._id)
      formData.append('file', event[0])

      this.entrepriseService.uploadLogo(formData).subscribe(() => {
        this.ToastService.add({ severity: 'success', summary: 'Photo de profil', detail: 'Mise à jour de votre photo de profil avec succès' });
        this.imgSrc = "../assets/images/avatar.PNG"
        this.reader.readAsDataURL(event[0]);
        let avoidError: any = document.getElementById('selectedFile')
        avoidError.value = ""
      }, (error) => {
        console.error(error)
      })
    }
  }

}
