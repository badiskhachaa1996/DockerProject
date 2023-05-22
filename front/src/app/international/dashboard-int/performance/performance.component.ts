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

  source = [];
  rentree_scolaire = [];
  formation = [];
  dates = [null, null];
  ecole = [];
  campus = [];
  pays = [];

  stats = {
    orientation: {
      assigned: 0,
      contacted: 0,
      oriented: 0,
      suspension: 0,
      joignable: 0,
      nn_joignable: 0,
      valided: 0,
      nn_valided: 0
    },
    admission: {
      prospects: 0,
      attestations: 0
    },
    paiements: { nb: 0 },
    consulaire: {
      prospects: 0,
      logements: 0
    },
    global: {
      prospects: 0,
      daily_contact: 0,
      delai: 0
    }
  }
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
    this.AService.getDataForDashboardPerformance(this.memberSelected, { source: this.source, rentree_scolaire: this.rentree_scolaire, formation: this.formation, dates: this.dates, ecole: this.dates, campus: this.campus, pays: this.pays, }).subscribe(data => {
      this.stats = data
      console.log(data)
    })
  }

}
