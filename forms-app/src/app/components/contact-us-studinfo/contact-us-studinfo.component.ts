import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators} from "@angular/forms";
import {ContactUsService} from "../../services/contact-us.service";
import {ViewportScroller} from "@angular/common";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {EcoleAdmission} from "../../models/EcoleAdmission";
import {RentreeAdmission} from "../../models/RentreeAdmission";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-contact-us-studinfo',
  templateUrl: './contact-us-studinfo.component.html',
  styleUrls: ['./contact-us-studinfo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactUsStudinfoComponent implements OnInit {
  hideFormations = false;
  aFormGroup!: UntypedFormGroup;

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
      this.LCS.create({ ...this.addForm.value, date_creation: new Date(), custom_id: this.generateID(), source: `Site Web STUDINFO`, numero_whatsapp }).subscribe(data => {
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
  ngOnInit(): void {

    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });

  }

}
