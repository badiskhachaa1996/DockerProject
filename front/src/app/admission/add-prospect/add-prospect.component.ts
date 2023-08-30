import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { Partenaire } from 'src/app/models/Partenaire';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { PartenaireService } from 'src/app/services/partenaire.service';

@Component({
  selector: 'app-add-prospect',
  templateUrl: './add-prospect.component.html',
  styleUrls: ['./add-prospect.component.scss']
})
export class AddProspectComponent implements OnInit {

  RegisterForm2: FormGroup = new FormGroup({
    ecole: new FormControl('', [Validators.required]),
    commercial: new FormControl('',),
    source: new FormControl('', Validators.required)
  })

  isPartenaireExterne = false

  ecoleList = [
    { label: "Estya", value: "estya" },
    { label: "ESPIC", value: "espic" },
    { label: "Académie des gouvernantes", value: "adg" },
    { label: "Estya Dubai", value: "estya-dubai" },
    { label: "Studinfo", value: "studinfo" },
    { label: "INTUNS", value: "intuns" },
    { label: "Intunivesity", value: "intunivesity" },
    { label: "ICBS Malte", value: "icbsmalta" },
    { label: "INT Education", value: "inteducation" }
  ]

  sourceList = [
    { label: "Partenaire", value: "Partenaire" },
    { label: "Equipe commerciale", value: "Equipe commerciale" },
  ]

  commercialList = []

  EcoleListRework = []

  constructor(private commercialService: CommercialPartenaireService, private router: Router, private FAService: FormulaireAdmissionService, private PService: PartenaireService) { }

  ngOnInit(): void {
    if (localStorage.getItem("token") != null) {
      let decodeToken: any = jwt_decode(localStorage.getItem("token"))
      this.isPartenaireExterne = decodeToken.role === 'Agent' && decodeToken.type === 'Commercial' && !decodeToken.service_id
      if (this.isPartenaireExterne) {
        this.RegisterForm2.patchValue({ source: 'Partenaire' });
        this.commercialService.getByUserId(decodeToken.id).subscribe(commercial => {
          if (commercial) {
            this.RegisterForm2.patchValue({ commercial: commercial.code_commercial_partenaire })
          }
        })
      } else {
        this.commercialService.getAllPopulate().subscribe(commercials => {
          commercials.forEach(commercial => {
            let { user_id }: any = commercial
            if (user_id && commercial.isAdmin)
              this.commercialList.push({ label: `${user_id.lastname} ${user_id.firstname}`, value: commercial.code_commercial_partenaire })
          })
        })
      }

      if (!this.isPartenaireExterne && (decodeToken.type == "Initial" || decodeToken.type == "Alternant"))
        this.RegisterForm2.patchValue({ source: 'Etudiant interne' });
      else if (!this.isPartenaireExterne && decodeToken.type == "Prospect")
        this.RegisterForm2.patchValue({ source: 'Lead' });


      this.FAService.EAgetAll().subscribe(data => {
        data.forEach(e => {
          this.EcoleListRework.push({ label: e.titre, value: e.url_form })
          //this.sourceList.push({ label: "Site web " + e.titre, value: "Site web " + e.titre })
        })
        this.sourceList.push({ label: "Site Web", value: "Site Web" })
        this.sourceList = this.sourceList.concat([
          { label: "Equipe communication", value: "Equipe communication" },
          { label: "Bureau Congo", value: "Bureau Congo" },
          { label: "Bureau Maroc", value: "Bureau Maroc" },
          { label: "Collaborateur interne", value: "Collaborateur interne" },
          { label: "Report", value: "Report" },
          { label: "Partenaire", value: "Partenaire" },//par défaut si Partenaire
          { label: "Equipe commerciale interne - bureau Tunis", value: "Equipe commerciale interne - bureau Tunis" },
          { label: "Equipe commerciale interne - bureau Paris", value: "Equipe commerciale interne - bureau Paris" },
          { label: "Equipe commerciale interne - bureau Montpellier", value: "Equipe commerciale interne - bureau Montpellier" },
          { label: "Equipe commerciale interne - bureau Congo Brazzaville", value: "Equipe commerciale interne - bureau Congo Brazzaville" },
          { label: "Equipe commerciale interne - bureau Dubaï", value: "Equipe commerciale interne - bureau Dubaï" },
          { label: "Equipe commerciale interne - bureau Maroc", value: "Equipe commerciale interne - bureau Maroc" },
          { label: "Etudiant interne", value: "Etudiant interne" },// Par défaut si Etudiant ou Alternant
          { label: "Lead", value: "Lead" }, //Par défaut si Lead
          { label: "Site web", value: "Site web" },
          { label: "Candidature spontanée", value: "Candidature spontanée" },
        ])
      })
    }

  }

  redirectToForm2() {
    let code = this.RegisterForm2.value.commercial
    let source = this.RegisterForm2.value.source
    source = source.replace('ECOLE', this.RegisterForm2.value.ecole)
    localStorage.setItem("sourceProspect", source)
    localStorage.setItem('agent', 'oui')
    if (!code)
      this.router.navigate(['formulaire-admission-international', this.RegisterForm2.value.ecole])
    else
      this.router.navigate(['formulaire-admission-international', this.RegisterForm2.value.ecole, code])
  }

  changeSource(source: string) {
    console.log(source)
    if (source == "Partenaire") {
      this.PService.getAll().subscribe(commercials => {
        this.commercialList = []
        commercials.forEach(commercial => {
          this.commercialList.push({ label: `${commercial.nom}`, value: commercial.code_partenaire })
        })
      })
    } else {
      this.commercialService.getAllPopulate().subscribe(commercials => {
        this.commercialList = []
        commercials.forEach(commercial => {
          let { user_id }: any = commercial
          if (user_id && commercial.isAdmin)
            this.commercialList.push({ label: `${user_id.lastname} ${user_id.firstname}`, value: commercial.code_commercial_partenaire })
        })
      })
    }
  }
}
