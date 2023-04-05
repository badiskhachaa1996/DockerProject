import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reglement',
  templateUrl: './reglement.component.html',
  styleUrls: ['./reglement.component.scss']
})
export class ReglementComponent implements OnInit {

  constructor() { }

  showFormAddFacture = false

  ventes = []

  formAddFacture: FormGroup = new FormGroup({
    numero: new FormControl('', Validators.required),
    montant: new FormControl('', Validators.required),
    tva: new FormControl('', Validators.required),
    statut: new FormControl('', Validators.required),
    nature: new FormControl('', Validators.required),
    date_paiement: new FormControl('', Validators.required),
  })

  onAddFacture() {

  }

  initEditForm(facture) {

  }

  ngOnInit(): void {
  }

}
