import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-externe-skillsnet',
  templateUrl: './externe-skillsnet.component.html',
  styleUrls: ['./externe-skillsnet.component.scss']
})
export class ExterneSkillsnetComponent implements OnInit {

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.France, CountryISO.Tunisia];

  formAddExterne: FormGroup = new FormGroup({
    nom: new FormControl('', [Validators.required]),
    prenom: new FormControl('', [Validators.required]),
    phone: new FormControl(undefined, [Validators.required]),
    email_perso: new FormControl('', [Validators.required, Validators.email]),
    civilite: new FormControl('', Validators.required)
  })

  constructor() { }

  ngOnInit(): void {
  }

}
