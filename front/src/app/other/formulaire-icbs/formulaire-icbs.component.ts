import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { MessageService } from 'primeng/api';
import { FormulaireICBS } from 'src/app/models/FormulaireICBS';
import { FormulaireIcbsService } from 'src/app/services/other/formulaire-icbs.service';

@Component({
  selector: 'app-formulaire-icbs',
  templateUrl: './formulaire-icbs.component.html',
  styleUrls: ['./formulaire-icbs.component.scss']
})
export class FormulaireIcbsComponent implements OnInit {

  occupations = [
    { label: 'Employee', value: "Employee" },
    { label: 'Looking for a job', value: "Looking for a job" },
    { label: 'Student', value: "Student" },
    { label: 'High school student ', value: "High school student " },
  ]

  languages = [
    { label: 'English', value: 'English' },
    { label: 'German', value: 'German' },
    { label: 'French', value: 'French' },
    { label: 'Arabic', value: 'Arabic' },
    { label: 'Spanish', value: 'Spanish' },
  ]

  // données du bouton radio pour le choix du type de test
  testTypes: any[] = [];

  leadData = {};

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedArabEmirates];
  
  RegisterForm = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    age: new UntypedFormControl(null, Validators.required),
    phone: new UntypedFormControl('', Validators.required),
    whatsapp: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    occupation: new UntypedFormControl('', Validators.required),
    field: new UntypedFormControl(''),
    langue: new UntypedFormControl('', Validators.required),
    testType:new UntypedFormControl('', Validators.required),
  });

  get phone() { return this.RegisterForm.get('phone'); }
  get whatsapp() { return this.RegisterForm.get('whatsapp'); }

  ETAT = "DEBUT"

  saveFormulaire() {
    let data = { ...this.RegisterForm.value, date_creation: new Date() }
    this.RegisterForm.reset();
    this.leadData = data;
    this.FICBSService.create(data).subscribe(data => {
      if (data) {
        this.ToastService.add({ severity: 'success', summary: 'Le formulaire a été envoyé' })
        this.ETAT = 'FIN';
      }
    })
  }
  
  constructor(private FICBSService: FormulaireIcbsService, private ToastService: MessageService) { }

  ngOnInit(): void {
    this.testTypes = [
      { name: 'On campus', key: 'A' },
      { name: 'Online', key: 'B' },
    ];
  }

}
