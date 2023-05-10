import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { FormationAdmission } from 'src/app/models/FormationAdmission';
import { Prospect } from 'src/app/models/Prospect';
import { RentreeAdmission } from 'src/app/models/RentreeAdmission';
import { User } from 'src/app/models/User';
import { AdmissionService } from 'src/app/services/admission.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-gen-doc-preinscription',
  templateUrl: './gen-doc-preinscription.component.html',
  styleUrls: ['./gen-doc-preinscription.component.scss']
})
export class GenDocPreinscriptionComponent implements OnInit {
  constructor(private AService: AdmissionService, private route: ActivatedRoute, private FAService: FormulaireAdmissionService) { }
  prospect: Prospect
  user: User
  ecole: EcoleAdmission
  formation: FormationAdmission
  rentree_scolaire: RentreeAdmission
  formulaire = new FormGroup({
    custom_id: new FormControl('', Validators.required),
    rentree_scolaire: new FormControl('', Validators.required),
    nom: new FormControl('', Validators.required),
    prenom: new FormControl('', Validators.required),
    date_naissance: new FormControl('', Validators.required),
    pays: new FormControl('', Validators.required),
    nationalite: new FormControl('', Validators.required),
    campus: new FormControl('', Validators.required),
    formation: new FormControl('', Validators.required),
    rncp: new FormControl('', Validators.required),
    certificateur: new FormControl('', Validators.required),
    frais: new FormControl('', Validators.required),
    date_rentree_scolaire: new FormControl('', Validators.required),
    date_limite: new FormControl('', Validators.required),
    document_id: new FormControl('')
  })
  ngOnInit(): void {
    this.AService.getPopulateByUserid(this.route.snapshot.paramMap.get('prospect_id')).subscribe(data => {
      this.prospect = data
      let { user_id }: any = data.user_id
      this.user = user_id
      this.formulaire.patchValue({
        custom_id: data.customid,
        rentree_scolaire: data.rentree_scolaire,
        nom: this.user.lastname,
        prenom: this.user.firstname,
        date_naissance: this.convertTime(data.date_naissance),
        pays: this.user.pays_adresse,
        nationalite: this.user.nationnalite,
        campus: this.prospect.campus_choix_1
      })
      this.FAService.EAgetByParams(this.route.snapshot.paramMap.get('ecole')).subscribe(dataE => {
        this.ecole = dataE
        this.FAService.RAgetByName(data.rentree_scolaire, dataE._id).subscribe(dataR => {
          this.rentree_scolaire = dataR
          this.formulaire.patchValue({
            date_rentree_scolaire: this.convertTime(dataR.date_commencement),
            date_limite: this.convertTime(dataR.date_fin_inscription)
          })
        })
      })

    })

    this.FAService.FAgetByID(this.route.snapshot.paramMap.get('formation')).subscribe(data => {
      this.formation = data
      this.formulaire.patchValue({
        formation: data.nom,
        certificateur: data.certificateur,
        rncp: data.rncp,
        frais: data.tarif
      })
    })

  }

  convertTime(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

}
