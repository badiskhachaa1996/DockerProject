import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { Prospect } from 'src/app/models/Prospect';
import { ProspectAlternable } from 'src/app/models/ProspectAlternable';
import { User } from 'src/app/models/User';
import { AdmissionService } from 'src/app/services/admission.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-prospect-alt-form',
  templateUrl: './prospect-alt-form.component.html',
  styleUrls: ['./prospect-alt-form.component.scss']
})
export class ProspectAltFormComponent implements OnInit {

  // lien du logo intedgroup
  logoSrc: string;

  // handicap options
  handicapOptions: any[];

  // index du formulaire
  activeIndex: number = 0;
  // étape du formulaire
  formSteps: any[];

  // formulaire de demande d'admission
  formAskAdmission: FormGroup;
  showForm: boolean = true;
  showValidatedPart: boolean = false;

  // variables
  civiliteList: any = environment.civilite;
  paysList: any = environment.pays;
  nationalityList: any = environment.nationalites;
  commercialId: string;
  commercial: CommercialPartenaire;

  constructor(private messageService: MessageService ,private commercialService: CommercialPartenaireService, private formBuilder: FormBuilder, private userService: AuthService, private activatedRoute: ActivatedRoute, private admissionService: AdmissionService) { }

  ngOnInit(): void {
    // recuperation du commercial via l'id dans l'url
    this.commercialId = this.activatedRoute.snapshot.paramMap.get('id');

    // initialisation du lien du logo
    this.logoSrc = 'assets/images/logo-ims.png';

    // handicap options
    this.handicapOptions = [
      {name: 'Oui', value: 1},
      {name: 'Non', value: 0},
    ];

    // étape du formulaire
    this.formSteps = [
      "Identité",
      "Informations",
      "Parcours",
    ];

    // initialisation du formulaire de demande d'admission
    this.formAskAdmission = this.formBuilder.group({
      civility: [environment.civilite[0], Validators.required],
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      nir: ['', Validators.required],
      country: [environment.pays[0], Validators.required],
      city: ['', Validators.required],
      code_postal: ['', Validators.required],
      rue_number: ['', Validators.required],
      rue_name: ['', Validators.required],
      indicatif: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      date_naissance: ['', Validators.required],
      commune_naissance: ['', Validators.required],
      nationalite: [environment.nationalites[0], Validators.required],
      handicap: ['', Validators.required],
      last_diplome: ['', Validators.required],
      diplome_in_progress: ['', Validators.required],
      diplome_up: ['', Validators.required],
    });
  }

  // next on the form
  onNextPage(): void
  {
    this.activeIndex++;
  }

  // previous on the form
  onPreviousPage(): void
  {
    this.activeIndex--;
  }

  // méthode de création du nouveau prospect
  onAsk(): void
  {
    const formValue = this.formAskAdmission.value;
    const prospect = new ProspectAlternable(); //* prospect de type alternance
    const user = new User();

    prospect.date_naissance         = formValue.date_naissance;
    prospect.nir                    = formValue.nir;
    prospect.commune_naissance      = formValue.commune_naissance;
    prospect.isHandicap             = formValue.handicap.value;
    prospect.last_title_prepared    = formValue.last_diplome;
    prospect.title_in_progress      = formValue.diplome_in_progress;
    prospect.highest_title          = formValue.diplome_up;
    prospect.commercial_id          = this.commercialId;

    user.firstname  = formValue.firstname;
    user.lastname   = formValue.lastname;
    user.indicatif  = formValue.indicatif;
    user.phone      = formValue.phone;
    user.email_perso = formValue.email;
    user.role = 'user';
    user.civilite = formValue.civility.viewValue;
    user.type = 'Prospect alt';
    user.pays_adresse = formValue.country.value;
    user.ville_adresse = formValue.city;
    user.rue_adresse = formValue.rue_name;
    user.numero_adresse = formValue.rue_number;
    user.postal_adresse = formValue.code_postal;
    user.nationnalite = formValue.nationalite.value;
    user.verifedEmail = false;

    // création du prospect et du user
    this.admissionService.postProspectAlt({ prospect: prospect, user: user })
    .then((success) => { 
      this.messageService.add({ severity: 'success', summary: 'Inscription', detail: success.successMsg }); 
      this.formAskAdmission.reset();
      this.activeIndex = 0;
      this.showForm = false;
      this.showValidatedPart = true;
    })
    .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Inscription', detail: error.errMsg }); })
  }

}
