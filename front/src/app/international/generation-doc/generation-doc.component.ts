import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdmissionService } from 'src/app/services/admission.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-generation-doc',
  templateUrl: './generation-doc.component.html',
  styleUrls: ['./generation-doc.component.scss']
})
export class GenerationDocComponent implements OnInit {

  documentDropdown = [
    { label: "Inscription", value: "inscription" },
    { label: "Préinscription", value: "preinscription" },
    { label: "Paiement préinscription", value: "paiement-preinscription" },
    { label: "Paiement préinscription - acompte", value: "paiement-preinscription-acompte" },
    { label: "Paiement acompte", value: "paiement-acompte" },
    { label: "Dérogation", value: "derogation" },
    { label: "Lettre d'acceptation", value: "lettre-acceptation" },
  ]

  formationDropdown = []
  ecoleDropdown = []
  prospectDropdown = []
  rentreeDropdown = []
  documents = []

  constructor(private router: Router, private AService: AdmissionService, private FAService: FormulaireAdmissionService) { }

  ngOnInit(): void {
    this.FAService.EAgetAll().subscribe(data => {
      data.forEach(ecole => {
        this.ecoleDropdown.push({ label: ecole.titre, value: ecole._id })
      })
    })
    this.FAService.FAgetAll().subscribe(data => {
      data.forEach(f => {
        this.formationDropdown.push({ label: f.nom, value: f._id })
      })
    })
    this.AService.getAllSourcing().subscribe(data => {
      this.prospectDropdown = []
      data.forEach(p => {
        let { user_id }: any = p
        if (user_id)
          this.prospectDropdown.push({ label: `${p.customid} - ${user_id.lastname} ${user_id.firstname}`, value: user_id._id })
      })
    })
    this.FAService.RAgetAll().subscribe(data => {
      data.forEach(d => {
        this.rentreeDropdown.push({ label: d.nom, value: d._id })
      })
    })
  }



  documentForm = new FormGroup({
    ecole: new FormControl('', Validators.required),
    formation: new FormControl('', Validators.required),
    prospect_id: new FormControl('', Validators.required),
    document: new FormControl('', Validators.required),
    rentree_scolaire: new FormControl('', Validators.required)
  })

  onSelectEcole(){
    this.FAService.RAgetAllByEcoleID(this.documentForm.value.ecole).subscribe(data => {
      this.rentreeDropdown = []
      console.log(data,this.documentForm.value.ecole)
      data.forEach(d => {
        this.rentreeDropdown.push({ label: d.nom, value: d._id })
      })
    })
  }

  openTemplate() {
    //console.log(['international/generation-documents', this.documentForm.value.document, this.documentForm.value.ecole, this.documentForm.value.prospect_id, this.documentForm.value.formation])
    this.router.navigate(['international/generation-documents', this.documentForm.value.document, this.documentForm.value.ecole, this.documentForm.value.prospect_id, this.documentForm.value.formation, this.documentForm.value.rentree_scolaire])
  }

}
