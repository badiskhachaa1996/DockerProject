import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateSejourMI } from 'src/app/models/DateSejourMI';
import { DestinationMI } from 'src/app/models/DestinationMI';
import { FormulaireMIService } from 'src/app/services/formulaire-mi.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-formulaire-mi',
  templateUrl: './formulaire-mi.component.html',
  styleUrls: ['./formulaire-mi.component.scss']
})
export class FormulaireMIComponent implements OnInit {

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedArabEmirates];

  domaines = [
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Commerce', value: 'Commerce' },
    { label: 'Gestion d\'entreprise', value: 'Gestion d\'entreprise' },
    { label: 'Informatique', value: 'Informatique' },
    { label: 'Comptabilité', value: 'Comptabilité' },
    { label: 'Comptabilité', value: 'Comptabilité' },
    { label: 'Ressources Humaines', value: 'Ressources Humaines' },
    { label: 'Bâtiment', value: 'Bâtiment' },
    { label: 'Social Sanitaire', value: 'Social Sanitaire' },
    { label: 'Autre', value: 'Autre' },
  ]

  avantages = [
    { label: 'Facebook', value: 'Facebook' },
    { label: 'Instagram', value: 'Instagram' },
    { label: 'Linkedin', value: 'Linkedin' },
    { label: 'Indeed', value: 'Indeed' },
    { label: 'Google', value: 'Google' },
    { label: 'Mail', value: 'Mail' },
    { label: 'Contacter par l\'un de nos commerciaux', value: 'Contacter par l\'un de nos commerciaux' },
    { label: 'Autre', value: 'Autre' },
  ]

  destinations = []

  dateSejours = []

  RegisterForm = new FormGroup({
    name: new FormControl('', Validators.required),
    date_naissance: new FormControl('', Validators.required),
    telephone: new FormControl('', Validators.required),
    mail: new FormControl('', Validators.required),
    ecole: new FormControl('', Validators.required),
    domaine: new FormControl('', Validators.required),
    destination: new FormControl([], Validators.required),
    dateSejour: new FormControl([], Validators.required),
    avantage: new FormControl('', Validators.required),
    date_creation: new FormControl(new Date()),
  })


  loadData() {
    this.FMIService.DSgetAll().subscribe(ds => {
      ds.forEach(d => {
        this.dateSejours.push({ label: d.name, value: d._id })
      })
    })
    this.FMIService.DEgetAll().subscribe(de => {
      this.destinations = []
      de.forEach(d => {
        this.destinations.push({ label: d.name, value: d._id })
      })


    })
  }

  constructor(private FMIService: FormulaireMIService, private ToastService: MessageService) { }

  resultat;

  saveFormulaire() {
    let data = { ...this.RegisterForm.value, date_creation: new Date() }
    this.RegisterForm.reset();
    this.FMIService.create(data).subscribe(data => {
      if (data) {
        this.ToastService.add({ severity: 'success', summary: 'Le formulaire a été envoyé' })
        this.resultat = data
      }
    })
  }

  ngOnInit(): void {
    this.loadData()
  }

}
