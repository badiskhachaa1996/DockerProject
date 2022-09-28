import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndividualAccount } from 'src/app/models/lemonway/IndividualAccount';
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
  checked: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    //Initialisation du formulaire
    this.onInitForm();
  }

  //Methode d'initialisation du formulaire de création de compte
  onInitForm(): void 
  {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      title: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: [''],
      postCode: [''],
      city: [''],
      country: [''],
      dateN: ['', Validators.required],
      cityN: [''],
      countryN: [''],
      nationality: ['', Validators.required],
      indicatifPhoneNumber: [''],
      phoneNumber: [''],
      indicatifMobileNumber: [''],
      mobileNumber: [''],
      isDebtor: [false],
      payerOrBeneficiary: [this.payerOrBeneficiaryList[0], Validators.required],
      isOneTimeCustomerAccount: [false],
      isTechnicalAccount: [false],
      isUltimateBeneficialOwner: [false],
      valider: [false, Validators.required],
    });
  }


  //Methode d'ajout d'un nouveau compte individuel
  onAddAccount(): void 
  {
    const account = new IndividualAccount();
    

    account.email                         = this.form.get('email')?.value;
    account.title                         = this.form.get('title')?.value;
    account.firstName                     = this.form.get('firstName')?.value;
    account.lastName                      = this.form.get('lastName')?.value;
    account.adresse                       = {
                                              'street': this.form.get('street')?.value,
                                              'postCode': this.form.get('postCode')?.value,
                                              'city': this.form.get('city')?.value,
                                              'country': this.form.get('country')?.value.value,
                                            };
  account.birth                           = {
                                            'date': this.form.get('dateN')?.value,
                                            'city': this.form.get('cityN')?.value,
                                            'country': this.form.get('countryN')?.value.value,
                                          };
    account.nationality                   = this.form.get('nationality')?.value.value;
    account.phoneNumber                   = `${this.form.get('indicatifPhoneNumber')?.value}${this.form.get('phoneNumber').value}`;
    account.mobileNumber                  = `${this.form.get('indicatifMobileNumber')?.value}${this.form.get('mobileNumber').value}`;
    account.isDebtor                      = this.form.get('isDebtor')?.value;
    account.payerOrBeneficiary            = this.form.get('payerOrBeneficiary')?.value.value;
    account.isOneTimeCustomerAccount      = this.form.get('isOneTimeCustomerAccount')?.value;
    account.isTechnicalAccount            = this.form.get('isTechnicalAccount')?.value;
    account.isUltimateBeneficialOwner     = this.form.get('isUltimateBeneficialOwner')?.value;

  }
}
