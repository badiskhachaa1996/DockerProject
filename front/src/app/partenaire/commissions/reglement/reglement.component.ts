import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reglement',
  templateUrl: './reglement.component.html',
  styleUrls: ['./reglement.component.scss']
})
export class ReglementComponent implements OnInit {

  constructor() { }

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

  ngOnInit(): void {
  }

}
