import { Component, OnInit } from '@angular/core';
import { Demande_events } from '../models/Demande_events';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { environment } from 'src/environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DemandeEventsService } from '../services/demande-events.service';
import { sourceForm } from '../models/sourceForm';


@Component({
  selector: 'app-demande-events',
  templateUrl: './demande-events.component.html',
  styleUrls: ['./demande-events.component.scss']
})
export class DemandeEventsComponent implements OnInit {
  //Déclarations
  addeventForm: FormGroup;
  nationList = environment.nationalites;
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

  sourceListe = [
    { label: "Réseaux sociaux", value: "Réseaux sociaux" },
    { label: "Affichage extérieur", value: "Affichage extérieur" },
    { label: "Par le bias d'un proche", value: "Par le bias d'un proche" },
    { label: "Autre", value: "Autre" }
  ]

  domaineListe = [
    { label: "Commerce", value: "Commerce" },
    { label: "Informatique", value: "Informatique" },
    { label: "Ressources Humaines", value: "Ressources Humaines" },
    { label: "Comptabilité", value: "Comptabilité" },
    { label: "BIM", value: "BIM" },
  ]

  //initialisation du formulaire
  onInitAddEventForm() {
    this.addeventForm = this.formBuilder.group({

      nom: ['', [Validators.required, Validators.pattern("^[a-zA-Zéèàêô -]+$")]],
      prenom: ['', [Validators.required, Validators.pattern("^[a-zA-Zéèàêô -]+$")]],
      date_naissance: new FormControl('', [Validators.required]),
      pays_naissance: [this.paysList[0], Validators.required],
      domaine:new FormControl(this.domaineListe[0].value,Validators.required),
      nationalite: new FormControl(this.nationList[0], [Validators.required]),
      email: ['', [Validators.email]],
      phone: [undefined, [Validators.required]],
      lvl_formation: ['', Validators.required],
      source: [this.sourceListe[0].value, Validators.required],
      inscrit_etablissement: [false, Validators.required],
      etablissement: ['']

    })
  }


  get nom() { return this.addeventForm.get('nom'); };
  get prenom() { return this.addeventForm.get('prenom'); };
  get date_naissance() { return this.addeventForm.get('date_naissance'); };
  get pays_naissance() { return this.addeventForm.get('pays_naissance').value; };
  get domaine() { return this.addeventForm.get('domaine'); };
  get nationalite() { return this.addeventForm.get('nationalite'); };
  get email() { return this.addeventForm.get('email'); };
  get phone() { return this.addeventForm.get('phone'); };
  get lvl_formation() { return this.addeventForm.get('lvl_formation'); };
  get source() { return this.addeventForm.get('source'); };
  get inscrit_etablissement() { return this.addeventForm.get('inscrit_etablissement'); };


  ///méthode d'ajout de l'event
  onAddEvent() {
    let source = new sourceForm(
      null,
      this.addeventForm.value.prenom,
      this.addeventForm.value.nom,
      this.addeventForm.value.date_naissance, //Object Date
      this.addeventForm.value.pays_naissance.value, //liste
      this.addeventForm.value.nationalite.value, //liste
      this.addeventForm.value.email,
      this.addeventForm.value.phone.internationalNumber,//phoneObject
      this.addeventForm.value.domaine,//liste
      this.addeventForm.value.source,//liste
      this.addeventForm.value.etablissement,
      this.addeventForm.value.inscrit_etablissement//boolean
    )

    this.dEventService.create(source).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Merci de votre participation' });
        this.onInitAddEventForm()
      }),
      ((error) => {
        console.error(error)
        this.messageService.add({ severity: 'error',summary:"Une erreur est arrivé\nMerci de contacter un Admin", detail: error.error });
      })
    )
  }


}
