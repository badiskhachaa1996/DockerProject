import { Component, OnInit } from '@angular/core';
import { Demande_events } from '../models/Demande_events';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { environment } from 'src/environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DemandeEventsService } from '../services/demande-events.service';


@Component({
  selector: 'app-demande-events',
  templateUrl: './demande-events.component.html',
  styleUrls: ['./demande-events.component.scss']
})
export class DemandeEventsComponent implements OnInit {
  //Déclarations
  addeventForm: FormGroup;
  paysList = environment.pays;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.France, CountryISO.Tunisia];

  constructor(private formBuilder: FormBuilder, private dEventService: DemandeEventsService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    
    this.onInitAddEventForm()
  }



  domaineList = [
    { value: "Marketing" },
    { value: "Commerce" },
    { value: "Comptabilité" },
    { value: "Droit" },
    { value: "Construction" },
  ]

  //initialisation du formulaire
  onInitAddEventForm() {
    this.addeventForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')]],
      nom: ['', [Validators.required, Validators.pattern("^[a-zA-Zéèàêô -]+$")]],
      phone: [undefined, [Validators.required]],
      pays_adresse: [this.paysList[0], Validators.required],
      domaine: ['', Validators.required],

    })
  }

  get email() { return this.addeventForm.get('email'); };
  get nom() { return this.addeventForm.get('nom'); };
  get phone() { return this.addeventForm.get('phone'); };
  get pays_adresse() { return this.addeventForm.get('pays_adresse').value; };
  get domaine() { return this.addeventForm.get('domaine').value; };


  ///méthode d'ajout de l'event
  onAddEvent() {

    let domaineSelect = [];
    this.addeventForm.value.domaine.forEach((e) => {
      domaineSelect.push(e.value)
    });
    console.log(domaineSelect)

    let email = this.addeventForm.get('email')?.value;
    let nom = this.addeventForm.get('nom')?.value;
    let phone = this.addeventForm.get('phone')?.value;
    let pays_adresse = this.addeventForm.get('pays_adresse')?.value.value;

    let newEvent = new Demande_events(
      email,
      nom,
      phone.internationalNumber,
      pays_adresse,
      domaineSelect
    )

    this.dEventService.create({ 'newEvent': newEvent }).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Inscription ajoutée' });
      }),
      ((error) => {
        console.error(error)
        this.messageService.add({ severity: 'error', summary: error.error });
      })
    )
  }


}
