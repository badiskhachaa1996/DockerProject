import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProspectIntuns } from 'src/app/models/ProspectIntuns';
import { AdmissionService } from 'src/app/services/admission.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-formulaire-intuns',
  templateUrl: './formulaire-intuns.component.html',
  styleUrls: ['./formulaire-intuns.component.scss']
})
export class FormulaireIntunsComponent implements OnInit {
  ActiveIndex = 0;
  paysList = environment.pays;
  RegisterForm: FormGroup;
  formSteps: any[] = [
    "Infos",
    "Parcours",
    "Programme",
    "Partenaires",
    "Fin",
  ];
  statutList =
    [
      { label: 'Etudiant', value: 'Etudiant' },
      { label: 'Salarié', value: 'Salarié' },
      { label: 'Au chômage', value: 'Au chômage' },
      { label: 'Autre', value: 'Autre' },
    ];

  programeFrDropdown =
    [
      { value: "Niveau 6 : Chargé de Gestion et Management", label: "Niveau 6 : Chargé de Gestion et Management" },//(Titre RNCP No 34734)
      { value: "Niveau 6 : Chargé de Gestion Commerciale", label: "Niveau 6 : Chargé de Gestion Commerciale" },// (Titre RNCP No 34465)
      { value: "Niveau 7 : Manager en Ressources Humaines", label: "Niveau 7 : Manager en Ressources Humaines" },// (Titre RNCP No 35125)
      { value: "Titre : Ingénieur d’affaire", label: "Titre : Ingénieur d’affaire" }, //(Titre RNCP No 23692)
      { value: "ENGLISH PROGRAM L7 Project Management", label: "ENGLISH PROGRAM L7 Project Management" },//(1-year Master program)
    ];

  constructor(private formBuilder: FormBuilder, private ProspectService: AdmissionService, private MessageService: MessageService) { }

  ngOnInit(): void {
    this.onInitRegisterForm();
  }


  nextPage() {
    this.ActiveIndex++
  }

  previousPage() {
    this.ActiveIndex--
  }

  onInitRegisterForm() {
    this.RegisterForm = this.formBuilder.group({

      // ****** Informations générales *******
      nom: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
      prenom: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
      pays: new FormControl(this.paysList[76], [Validators.required, Validators.pattern('[^0-9]+')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      indicatif: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),

      statut_actuel: new FormControl('', [Validators.required]),
      other: new FormControl(''),

      programme: new FormControl('', [Validators.required]),
      remarque: new FormControl(''),
    });
  };

  get nom() { return this.RegisterForm.get('nom'); }
  get prenom() { return this.RegisterForm.get('prenom'); }
  get indicatif() { return this.RegisterForm.get('indicatif'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get email() { return this.RegisterForm.get('email'); }
  get pays() { return this.RegisterForm.get('pays').value; }
  get statut_actuel() { return this.RegisterForm.get('statut_actuel'); }
  get other() { return this.RegisterForm.get('other'); }
  get programme() { return this.RegisterForm.get('programme'); }
  get remarque() { return this.RegisterForm.get('remarque'); }

  onAddProspect() {
    let situation_actuel = this.RegisterForm.value.statut_actuel
    if (situation_actuel == 'Autre')
      situation_actuel = this.RegisterForm.value.other
    let formulaire_intuns = new ProspectIntuns(null,
      this.RegisterForm.value.nom,
      this.RegisterForm.value.prenom,
      new Date(),
      this.RegisterForm.value.email,
      this.RegisterForm.value.indicatif + " " + this.RegisterForm.value.phone,
      this.RegisterForm.value.programme,
      situation_actuel,
      this.RegisterForm.value.pays.value,
      this.RegisterForm.value.remarque
    )
    this.ProspectService.createIntuns(formulaire_intuns).subscribe(r => {
      console.log(r)
      this.ActiveIndex = 3
      this.MessageService.add({ severity: 'success', summary: 'Candidature envoyé avec succès !' })
    }, err => {
      this.ActiveIndex = 0
      console.log(err)
      if (err.error.message.startsWith('Vous avez déjà')) {
        this.MessageService.add({ severity: 'error', summary: 'Vous nous avez déjà envoyer une candidature !' })
      } else {
        this.MessageService.add({ severity: 'error', summary: 'Une erreur s\'est produit!', detail: err.message })
      }
    })

  }

}
