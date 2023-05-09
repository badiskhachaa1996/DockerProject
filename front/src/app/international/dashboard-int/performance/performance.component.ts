import { Component, OnInit } from '@angular/core';
import { MemberInt } from 'src/app/models/memberInt';
import { AdmissionService } from 'src/app/services/admission.service';
import { AuthService } from 'src/app/services/auth.service';
import { TeamsIntService } from 'src/app/services/teams-int.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent implements OnInit {

  memberList = []

  filterPays = environment.pays
  filterFormation = [
  ]
  filterSource = [
    { label: "Partenaire", value: "Partenaire" },
    { label: "Equipe commerciale", value: "Equipe commerciale" },
    { label: "Site web ESTYA", value: "Site web ESTYA" },
    { label: "Site web Ecole", value: "Site web" },
    { label: "Equipe communication", value: "Equipe communication" },
    { label: "Bureau Congo", value: "Bureau Congo" },
    { label: "Bureau Maroc", value: "Bureau Maroc" },
    { label: "Collaborateur interne", value: "Collaborateur interne" },
    { label: "Report", value: "Report" },
    { label: "IGE", value: "IGE" }
  ]
  filterRentree = []
  filterEcole = []
  filterCampus = [
    { value: "Paris - France", label: "Paris - France" },
    { value: "Montpellier - France", label: "Montpellier - France" },
    { value: "Brazzaville - Congo", label: "Brazzaville - Congo" },
    { value: "Rabat - Maroc", label: "Rabat - Maroc" },
    { value: "La Valette - Malte", label: "La Valette - Malte" },
    { value: "UAE - Dubai", label: "UAE - Dubai" },
    { value: "En ligne", label: "En ligne" },
  ]
  filterPhase = [
    { value: 'Non affecté', label: "Non affecté" },
    { value: "En phase d'orientation scolaire", label: "En phase d'orientation scolaire" },
    { value: "En phase d'admission", label: "En phase d'admission" },
    { value: "Paiements", label: "Paiements" }, //TODO
    { value: "En phase d'orientation consulaire", label: "En phase d'orientation consulaire" },
    { value: "Inscription définitive", label: "Inscription définitive" },
    //{ value: "Recours", label: "Recours" },
  ]

  source = [];
  rentree_scolaire = [];
  formation = [];
  dates = [null, null];
  ecole = [];
  campus = [];
  pays = [];
  phase_candidature = [];

  stats = {}
  imageToShow: any = "../assets/images/avatar.PNG";

  memberSelected: MemberInt

  reader: FileReader = new FileReader();

  constructor(private MemberIntService: TeamsIntService, private AuthService: AuthService, private AService: AdmissionService) { }

  ngOnInit(): void {
    this.MemberIntService.MIgetAll().subscribe(data => {
      data.forEach(m => {
        this.memberList.push({ label: `${m.user_id.lastname} ${m.user_id.firstname}`, value: m })
      })
    })
    this.reader.addEventListener("load", () => {
      this.imageToShow = this.reader.result;
    }, false);
  }

  onMemberSelect() {
    this.AuthService.getProfilePicture(this.memberSelected.user_id._id).subscribe((data) => {
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
    this.updateFilter()
  }
  updateFilter() {
    this.AService.getDataForDashboardPerformance(this.memberSelected, null).subscribe(data => {
      this.stats = data
    })
  }

}
