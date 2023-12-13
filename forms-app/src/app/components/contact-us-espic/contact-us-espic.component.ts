import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {environment} from "../../../environments/environment";
import {FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators} from "@angular/forms";
import {ContactUsService} from "../../services/contact-us.service";
import {ViewportScroller} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {EcoleAdmission} from "../../models/EcoleAdmission";
import {RentreeAdmission} from "../../models/RentreeAdmission";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-contact-us-espic',
  templateUrl: './contact-us-espic.component.html',
  styleUrls: ['./contact-us-espic.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactUsEspicComponent implements OnInit {
  hideFormations = false;
  aFormGroup!: UntypedFormGroup;
  sourceDropdown = [
    { value: 'Facebook' },
    { value: 'WhatsApp' },
    { value: 'Appel Telephonique' },
    { value: 'Mail' },
    { value: 'Visite au site' },
    { value: 'Online Meeting' },
    { value: 'Marketing' },
    { value: 'Recyclage' },
    { value: 'LinkedIn' },
  ]
  operationDropdown = [
    { value: 'Prospection FRP' },
    { value: 'Prospection ENP' },
    { value: 'Prospection ICBS Malte' },
    { value: 'Prospection ICBS Dubai' },
    { value: 'Prospection Alternant' },
  ]
  civiliteDropdown = [
    { value: 'Monsieur' },
    { value: 'Madame' },
    { value: 'Autre' },
  ]
  nationaliteDropdown = environment.nationalites
  paysDropdown = environment.pays
  nivDropdown = [
    { label: 'Pré-bac', value: 'Pré-bac' },
    { label: 'Bac +1', value: 'Bac +1' },
    { label: 'Bac +2', value: 'Bac +2' },
    { label: 'Bac +3', value: 'Bac +3' },
    { label: 'Bac +4', value: 'Bac +4' },
    { label: 'Bac +5', value: 'Bac +5' },
  ];
  statutList =
    [
      { label: 'Etudiant', value: 'Etudiant' },
      { label: 'Salarié', value: 'Salarié' },
      { label: 'Au chômage', value: 'Au chômage' },
      { label: 'Autre', value: 'Autre' },
    ];
  niveauFR =
    [
      { label: "Langue maternelle", value: "Langue maternelle" },
      { label: "J’ai une attestation de niveau (TCF DALF DELF..)", value: "J’ai une attestation de niveau (TCF DALF DELF..)" },
      { label: "Aucun de ces choix", value: "Aucun de ces choix" },
    ]
  niveauEN =
    [
      { label: "Langue maternelle", value: "Langue maternelle" },
      { label: "Avancé", value: "Avancé" },
      { label: "Intermédiaire", value: "Intermédiaire" },
      { label: "Basique", value: "Basique" },
      { label: "Je ne parle pas l’anglais", value: "Je ne parle pas l’anglais" },
    ]
  addForm: FormGroup = new FormGroup({
    nom: new FormControl('', Validators.required),
    prenom: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    numero_phone: new FormControl('+33', Validators.required),
    whatsapp: new FormControl(false),
    formation: new FormControl(''),
    note_choix: new FormControl('')
  })


  onAdd() {
    let numero_whatsapp = ''
    if (this.addForm.invalid) {
      //this.ToastService.add({ severity: 'error', summary: 'Votre email est déjà utilisé' });
      this.viewportScroller.scrollToAnchor('EmailForm');
    } else {
      if (this.addForm.value.whatsapp === true)
        numero_whatsapp = this.addForm.value.numero_phone
      this.LCS.create({ ...this.addForm.value, date_creation: new Date(), custom_id: this.generateID(), source: `Site Web ESPIC`, numero_whatsapp }).subscribe(data => {
          this.addForm.reset()
          this.ToastService.add({ severity: "success", summary: "Nous avons reçu votre demande de renseignement avec succès ! Nous reviendrons vers vous dans les plus brefs délais." })
        },
        ((error) => {
          //this.ToastService.add({ severity: 'error', summary: 'Votre email est déjà utilisé', detail: error?.error });
          console.error(error);
        }))
    }

  }

  generateID() {
    let prenom = this.addForm.value.prenom.substring(0, 1)
    let nom = this.addForm.value.nom.substring(0, 1)
    let dn = new Date(this.addForm.value.date_naissance)
    let jour = dn.getDate()
    let mois = dn.getMonth() + 1
    let year = dn.getFullYear().toString().substring(2)
    let nb = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    return ('SW' + prenom + nom + jour + mois + year + nb).toUpperCase()
  }


  constructor(private LCS: ContactUsService,  private viewportScroller: ViewportScroller, private ToastService: MessageService,
              private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.ECOLE = new EcoleAdmission();
    this.RENTREE = new RentreeAdmission();
  }
  ECOLE: EcoleAdmission
  RENTREE: RentreeAdmission
  siteKey = environment.recaptchaKey
  FormationList: any[] = []
  ngOnInit(): void {


    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });

    this.LCS.EAgetByParams('espic').subscribe(data => {
      console.log(data)
      this.hideFormations = !data;
      if (!data) return;
      //this.router.navigate(['/'])
      this.ECOLE = data
      data.formations?.forEach(f => {
        if (f.nom !== undefined) {
          this.FormationList.push({label: f.nom, value: f.nom})
        }
      })

    })
  }

}
