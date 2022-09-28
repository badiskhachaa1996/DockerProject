import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndividualAccount } from 'src/app/models/lemonway/IndividualAccount';
import { KYCType } from 'src/app/models/lemonway/KYCType';
import jwt_decode from "jwt-decode";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  account: IndividualAccount;
  checked: boolean = false;
  checked2: boolean = false;
  formUploadDocument: FormGroup;

  formUpdateAccount: FormGroup;

  isKyc: boolean = false;
  showFormUpdate: boolean = false;

  token: any;

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
                                
  typeDocList: any = [
      { value: 0, label: 'ID card (both sides in one file)' },
      { value: 1, label: 'Proof of address' },
      { value: 2, label: 'Scan of a proof of IBAN' },
      { value: 3, label: 'Passport (European Union)' },
      { value: 4, label: 'Passport (outside the European Union)' },
      { value: 5, label: 'Residence permit (both sides in one file)' },
      { value: 7, label: 'Official company registration document (Kbis extract or equivalent)' },
      { value: 11, label: 'Driver licence (both sides in one file)' },
      { value: 12, label: 'Status' },
      { value: 13, label: 'Selfie' },
      { value: 14, label: 'Other document type' },
      { value: 15, label: 'Other document type' },
      { value: 16, label: 'Other document type' },
      { value: 17, label: 'Other document type' },
      { value: 18, label: 'Other document type' },
      { value: 19, label: 'Other document type' },
      { value: 20, label: 'Other document type' },
      { value: 21, label: 'SDD mandate' },
  ];
  
  uploadedFile: any;
  buffer: string;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    //Décodage du token
    this.token = jwt_decode(localStorage.getItem("token"));


    //initialisation du formulaire
    this.onInitForms();
  }

  // Methode d'initialisation des formulaires 
  onInitForms(): void 
  {
    //Formulaire d'envoi de fichier KYC
    this.formUploadDocument = this.formBuilder.group({
      documentType: [this.typeDocList[0], Validators.required],
      valider: [false, Validators.required],
    });

    //Formulaire de modification des infos d'un compte bancaire
    this.formUpdateAccount = this.formBuilder.group({
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

  //Methode de selection du fichier à uploader
  onUpload(event)
  {
    if(event.target.files.length > 0) 
    {
      this.uploadedFile = event.target.files[0];
    }

    //Convertion du fichier en base 64
    let reader = new FileReader();
    reader.readAsDataURL(this.uploadedFile);
    reader.onload = () => {
      this.buffer = reader.result as string;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
    //end convertion

  }

  //Methode de soumission du formulaires
  onUploadDocument(): void
  {
    const kycType = new KYCType();

    kycType.name    = this.uploadedFile.name;
    kycType.type    = this.formUploadDocument.get('documentType')?.value.value;
    kycType.buffer  = this.buffer;
    kycType.sddMandateId = null;

    console.log(kycType);
  }


  //Methode de mise à jour d'un compte bancaire
  onUpdateAccount(): void
  {
    const account = new IndividualAccount();
    

    account.email                         = this.formUpdateAccount.get('email')?.value;
    account.title                         = this.formUpdateAccount.get('title')?.value;
    account.firstName                     = this.formUpdateAccount.get('firstName')?.value;
    account.lastName                      = this.formUpdateAccount.get('lastName')?.value;
    account.adresse                       = {
                                              'street': this.formUpdateAccount.get('street')?.value,
                                              'postCode': this.formUpdateAccount.get('postCode')?.value,
                                              'city': this.formUpdateAccount.get('city')?.value,
                                              'country': this.formUpdateAccount.get('country')?.value.value,
                                            };
  account.birth                           = {
                                            'date': this.formUpdateAccount.get('dateN')?.value,
                                            'city': this.formUpdateAccount.get('cityN')?.value,
                                            'country': this.formUpdateAccount.get('countryN')?.value.value,
                                          };
    account.nationality                   = this.formUpdateAccount.get('nationality')?.value.value;
    account.phoneNumber                   = `${this.formUpdateAccount.get('indicatifPhoneNumber')?.value}${this.formUpdateAccount.get('phoneNumber').value}`;
    account.mobileNumber                  = `${this.formUpdateAccount.get('indicatifMobileNumber')?.value}${this.formUpdateAccount.get('mobileNumber').value}`;
    account.isDebtor                      = this.formUpdateAccount.get('isDebtor')?.value;
    account.payerOrBeneficiary            = this.formUpdateAccount.get('payerOrBeneficiary')?.value.value;
    account.isOneTimeCustomerAccount      = this.formUpdateAccount.get('isOneTimeCustomerAccount')?.value;
    account.isTechnicalAccount            = this.formUpdateAccount.get('isTechnicalAccount')?.value;
    account.isUltimateBeneficialOwner     = this.formUpdateAccount.get('isUltimateBeneficialOwner')?.value;

  }

}
