import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    { label: 'Employees', value: "Employees" },
    { label: 'Student', value: "Student" },
    { label: 'High school student ', value: "High school student " },
    { label: 'Looking for a job', value: "Looking for a job" },
  ]

  languages = [
    { label: 'English', value: 'English' },
    { label: 'French', value: 'French' },
    { label: 'Arabic', value: 'Arabic' },
    { label: 'German', value: 'German' },
    { label: 'Chinese', value: 'Chinese' },
  ]

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.France, CountryISO.Tunisia];

  get phone() { return this.RegisterForm.get('phone'); }
  RegisterForm = new FormGroup({
    name: new FormControl('', Validators.required),
    age: new FormControl(null, Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    occupation: new FormControl('', Validators.required),
    field: new FormControl(''),
    langue: new FormControl('', Validators.required),
  })
  ETAT = "DEBUT"
  saveFormulaire() {
    let data = { ...this.RegisterForm.value, date_creation: new Date() }
    this.RegisterForm.reset()
    this.FICBSService.create(data).subscribe(data => {
      if (data) {
        this.ToastService.add({ severity: 'success', summary: 'Le formulaire a été envoyé' })
        this.ETAT = 'FIN'
      }
    })
  }
  constructor(private FICBSService: FormulaireIcbsService, private ToastService: MessageService) { }

  ngOnInit(): void {
  }

}
