import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';

@Component({
  selector: 'app-add-prospect',
  templateUrl: './add-prospect.component.html',
  styleUrls: ['./add-prospect.component.scss']
})
export class AddProspectComponent implements OnInit {

  RegisterForm: FormGroup = new FormGroup({
    ecole: new FormControl('', [Validators.required]),
    commercial: new FormControl('',),
  })

  ecoleList = [
    { label: "Estya", value: "estya" },
    { label: "ESPIC", value: "espic" },
    { label: "Eduhorizons", value: "eduhorizons" },
    { label: "Académie des gouvernantes", value: "adg" },
    { label: "Estya", value: "estya" },
    { label: "Estya Dubai", value: "estya-dubai" },
    { label: "Studinfo", value: "studinfo" },
    { label: "INTUNS", value: "intuns" },
    { label: "Intunivesity", value: "intunivesity" },
  ]

  commercialList = []

  constructor(private commercialService: CommercialPartenaireService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem("token") != null) {
      let decodeToken: any = jwt_decode(localStorage.getItem("token"))
      this.commercialService.getAllPopulate().subscribe(commercials => {
        commercials.forEach(commercial => {
          let bypass: any = commercial.user_id
          console.log(bypass)
          if (bypass)
            this.commercialList.push({ label: `${bypass.lastname} ${bypass.firstname}`, value: commercial.code_commercial_partenaire })
          if (bypass._id == decodeToken.id)
            this.RegisterForm.patchValue({ commercial: commercial.code_commercial_partenaire })
        })
      })
    }

  }

  redirectToForm() {
    let code = this.RegisterForm.value.commercial
    if (!code)
      this.router.navigate(['formulaire-admission', this.RegisterForm.value.ecole])
    else
      this.router.navigate(['formulaire-admission', this.RegisterForm.value.ecole, code])
  }

}
