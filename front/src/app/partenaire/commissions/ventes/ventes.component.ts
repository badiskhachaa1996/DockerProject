import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { VenteService } from 'src/app/services/vente.service';
import { Vente } from 'src/app/models/Vente';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
@Component({
  selector: 'app-ventes',
  templateUrl: './ventes.component.html',
  styleUrls: ['./ventes.component.scss']
})
export class VentesComponent implements OnInit {

  statutCommission = [
    { label: "Non payé", value: "Non payé" },
    { label: "Facturé payé", value: "Facturé payé" },
    { label: "A la source", value: "A la source" },
    { label: "Compensation", value: "Compensation" },
    { label: "Facturé non payé", value: "Facturé non payé" }
  ]
  filterStatutCommission = [
    { label: "Tous les status de commission", value: null },
    { label: "Non payé", value: "Non payé" },
    { label: "Facturé payé", value: "Facturé payé" },
    { label: "A la source", value: "A la source" },
    { label: "Compensation", value: "Compensation" },
    { label: "Facturé non payé", value: "Facturé non payé" }
  ]
  produitList = [
    { label: "Liste déroulante avec la description de commission", value: "Liste déroulante avec la description de commission" }
  ]

  filterProduit = [
    { label: "Tous les produits", value: null },
    { label: "Liste déroulante avec la description de commission", value: "Liste déroulante avec la description de commission" }
  ]

  listProspect = []

  constructor(private VenteService: VenteService, private MessageService: MessageService, private ProspectService: AdmissionService, private PartenaireService: PartenaireService) { }

  ngOnInit(): void {
    this.VenteService.getAll().subscribe(data => {
      this.ventes = data
    })
    this.PartenaireService.getAll().subscribe(data => {
      this.produitList = []
      data.forEach(d => {
        d.commissions.forEach(c => {
          this.produitList.push({ label: c.description, value: `${c.description}\nMontant:${c.montant}€` })
        })
      })

    })
    this.ProspectService.getAll().subscribe(data => {
      data.forEach(d => {
        let bypass: any = d.user_id
        this.listProspect.push({ label: `${bypass?.lastname} ${bypass?.firstname}`, value: d._id, custom_id: d.customid })
      })
    })
  }

  showFormAddVente = false

  ventes = []

  formAddVente: FormGroup = new FormGroup({
    produit: new FormControl('', Validators.required),
    montant: new FormControl('', Validators.required),
    tva: new FormControl('', Validators.required),
    statutCommission: new FormControl('', Validators.required),
    date_reglement: new FormControl('', Validators.required),
    prospect_id: new FormControl('', Validators.required)
  })

  onAddVente() {
    this.VenteService.create({ ...this.formAddVente.value }).subscribe(data => {
      this.ventes.push(data)
      this.showFormAddVente = false
      this.formAddVente.reset()
      this.MessageService.add({ severity: 'success', summary: "Création de facture avec succès" })
    })
  }

  initEditForm(vente: Vente) {
    this.venteSelected = vente
    this.formEditVente.patchValue({
      ...vente
    })
    this.formEditVente.patchValue({
      date_reglement: this.convertTime(vente.date_reglement)
    })
    this.showFormEditVente = true
  }

  venteSelected = null

  showFormEditVente = false

  formEditVente: FormGroup = new FormGroup({
    produit: new FormControl('', Validators.required),
    montant: new FormControl('', Validators.required),
    tva: new FormControl('', Validators.required),
    statutCommission: new FormControl('', Validators.required),
    date_reglement: new FormControl('', Validators.required)
  })

  onUpdateVente() {
    this.VenteService.update({ ...this.formEditVente.value, _id: this.venteSelected._id }).subscribe(data => {
      this.ventes[this.ventes.indexOf(this.venteSelected)] = data
      this.showFormEditVente = false
      this.formEditVente.reset()
      this.MessageService.add({ severity: 'success', summary: "Mise à jour de la facture avec succès" })
    })
  }

  convertTime(v) {
    let date = new Date(v)
    let day = date.getUTCDate() + 1
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    if (year != 1970)
      return `${day}-${month}-${year}`
    else
      return ""
  }
}
