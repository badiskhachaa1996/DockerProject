import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../country.service'; // Import your CountryService

@Component({
  selector: 'app-etudiant',
  templateUrl: './etudiant.component.html',
  styleUrls: ['./etudiant.component.css']
})
export class EtudiantComponent implements OnInit {
  selectedNationality: string = '';
  formData: any = {};

  demandeForm: FormGroup;
  civiliteOptions: string[] = ['Monsieur', 'Madame'];
  nationaliteOptions: string[] = []; 

  constructor(
    private formBuilder: FormBuilder,
    private countryService: CountryService 
  ) {
    this.demandeForm = this.formBuilder.group({
      civilite: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      nationalite: ['', Validators.required],
      indicatif: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      numero: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], 
      // email: ['', [Validators.required, Validators.email], this.validateEmail.bind(this)],

    });
  }

  ngOnInit() {
    this.countryService.getCountries().subscribe((countries: any[]) => {
      this.nationaliteOptions = countries.map((country) => country.name.common);
    });
  }

  onSubmit() {
    if (this.demandeForm.valid) {
      console.log('Form submitted:', this.demandeForm.value);
    } else {
      console.log('Form is invalid.');
    }
  }

  onClick() {
    console.log('Form Data:', this.demandeForm.value);
  }
}
