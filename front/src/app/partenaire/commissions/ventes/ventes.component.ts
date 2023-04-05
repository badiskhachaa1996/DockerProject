import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { VenteService } from 'src/app/services/vente.service';
import { Vente } from 'src/app/models/Vente';
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
  produitList = [
    { label: "Liste déroulante avec la description de commission", value: "Liste déroulante avec la description de commission" }
  ]

  listProspect = [
    { label: "Malick DIATTARA", value: "6284d5745f742c40b2a9e96a" }
  ]

  constructor(private VenteService: VenteService, private MessageService: MessageService) { }

  ngOnInit(): void {
    this.VenteService.getAll().subscribe(data => {
      this.ventes = data
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

  initEditForm(vente) {

  }
}
