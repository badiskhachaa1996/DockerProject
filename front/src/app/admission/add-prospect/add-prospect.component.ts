import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-add-prospect',
  templateUrl: './add-prospect.component.html',
  styleUrls: ['./add-prospect.component.scss']
})
export class AddProspectComponent implements OnInit {

  RegisterForm: FormGroup = new FormGroup({
    ecole: new FormControl('', [Validators.required]),
    commercial: new FormControl('',),
    source: new FormControl('', Validators.required)
  })

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
    { label: "ICBS Malte", value: "icbsmalte" },
    { label: "INT Education", value: "inteducation" }
  ]

  sourceList = [
    { label: "Partenaire", value: "Partenaire" },
    { label: "Equipe commerciale", value: "Equipe commerciale" },
    { label: "Site web ESTYA", value: "Site web ESTYA" },
    { label: "Site web Ecole", value: "Site web Ecole" },
    { label: "Equipe communication", value: "Equipe communication" },
    { label: "Bureau Congo", value: "Bureau Congo" },
    { label: "Bureau Maroc", value: "Bureau Maroc" },
    { label: "Collaborateur interne", value: "Collaborateur interne" },
    { label: "Report", value: "Report" },
    { label: "IGE", value: "IGE" }
  ]

  commercialList = []

  EcoleListRework = []

  constructor(private commercialService: CommercialPartenaireService, private router: Router, private FAService: FormulaireAdmissionService) { }

  ngOnInit(): void {
    if (localStorage.getItem("token") != null) {
      let decodeToken: any = jwt_decode(localStorage.getItem("token"))
      this.isPartenaireExterne = decodeToken.role === 'Agent' && decodeToken.type === 'Commercial' && !decodeToken.service_id
      this.commercialService.getAllPopulate().subscribe(commercials => {
        commercials.forEach(commercial => {
          let { user_id }: any = commercial
          if (user_id)
            this.commercialList.push({ label: `${user_id.lastname} ${user_id.firstname}`, value: commercial.code_commercial_partenaire })
          if (user_id && user_id._id == decodeToken.id)
            this.RegisterForm.patchValue({ commercial: commercial.code_commercial_partenaire, source: "Partenaire" })
        })
      })
      this.FAService.EAgetAll().subscribe(data => {
        data.forEach(e => {
          this.EcoleListRework.push({ label: e.titre, value: e.url_form })
        })
      })
    }

  }

  redirectToForm() {
    let code = this.RegisterForm.value.commercial
    let source = this.RegisterForm.value.source
    source = source.replace('ECOLE', this.RegisterForm.value.ecole)
    localStorage.setItem("sourceProspect", source)
    if (!code)
      this.router.navigate(['formulaire-admission', this.RegisterForm.value.ecole])
    else
      this.router.navigate(['formulaire-admission', this.RegisterForm.value.ecole, code])
  }

  redirectToForm2() {
    let code = this.RegisterForm2.value.commercial
    let source = this.RegisterForm2.value.source
    source = source.replace('ECOLE', this.RegisterForm.value.ecole)
    localStorage.setItem("sourceProspect", source)
    if (!code)
      this.router.navigate(['formulaire-admission-int', this.RegisterForm2.value.ecole])
    else
      this.router.navigate(['formulaire-admission-int', this.RegisterForm2.value.ecole, code])
  }

}
