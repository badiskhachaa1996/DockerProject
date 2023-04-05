import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-ventes',
  templateUrl: './ventes.component.html',
  styleUrls: ['./ventes.component.scss']
})
export class VentesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  showFormAddVente = false

  ventes = []

  formAddVente: FormGroup = new FormGroup({
    montant: new FormControl('', Validators.required),
    tva: new FormControl('', Validators.required),
    statutCommission: new FormControl('', Validators.required),
    date_reglement: new FormControl('', Validators.required),
  })

  onAddVente() {

  }

  initEditForm(vente) {

  }
}
