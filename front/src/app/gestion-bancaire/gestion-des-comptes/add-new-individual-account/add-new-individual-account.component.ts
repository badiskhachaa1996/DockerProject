import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-new-individual-account',
  templateUrl: './add-new-individual-account.component.html',
  styleUrls: ['./add-new-individual-account.component.scss']
})
export class AddNewIndividualAccountComponent implements OnInit {

  civiliteList = environment.civilite;
  paysList = environment.pays;
  paysIsoCodes = environment.isoCodes;
  nationaliteList = environment.nationalites;
  payerOrBeneficiaryList: any = [
                                  {
                                    label: 'Inconnu', 
                                    value: null,
                                  },
                                  {
                                    label: 'Payeur', 
                                    value: 1,
                                  },
                                  {
                                    label: 'Bénéficiare', 
                                    value: 2,
                                  }
                                ];


  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    //Initialisation du formulaire
    this.onInitForm();
  }

  //Methode d'initialisation du formulaire de création de compte
  onInitForm(): void 
  {

  }


  onAddAccount(): void 
  {

  }
}
