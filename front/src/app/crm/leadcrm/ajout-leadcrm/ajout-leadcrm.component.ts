import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LeadcrmService } from 'src/app/services/crm/leadcrm.service';
import { environment } from 'src/environments/environment';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-ajout-leadcrm',
  templateUrl: './ajout-leadcrm.component.html',
  styleUrls: ['./ajout-leadcrm.component.scss']
})
export class AjoutLeadcrmComponent implements OnInit {
  sourceDropdown = [
    { value: 'Facebook' },
    { value: 'WhatsApp' },
    { value: 'Appel Telephonique' },
    { value: 'Mail' },
    { value: 'Visite au site' },
    { value: 'Online Meeting' },
    { value: 'Marketing' },
    { value: 'Recyclage' },
    { value: 'LinkdIn' },
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



    addForm: FormGroup = new FormGroup({
      _id: new FormControl(''),
    source: new FormControl(''),
    civilite: new FormControl(''),
    nom: new FormControl('', Validators.required),
    prenom: new FormControl('', Validators.required),
    pays_residence: new FormControl(''),
    email: new FormControl(''),
    indicatif_phone: new FormControl(''),
    numero_phone: new FormControl(''),
    nationalite: new FormControl('', Validators.required),
    indicatif_whatsapp: new FormControl(''),
    numero_whatsapp: new FormControl(''),
    dernier_niveau_academique: new FormControl(''),
  })

  prospects = []

  onAdd() {
    this.LCS.create({ ...this.addForm.value, date_creation: new Date(), custom_id: this.generateID(), statut_dossier:"Non contacté", decision_qualification:"En attente" }).subscribe(data => {
      this.addForm.reset()
      this.ToastService.add({ severity: "success", summary: "Ajout d'un nouveau lead" })
    })
    this.LCS.getAll().subscribe(data => {
      this.prospects = data
    })
  }

  generateID() {
    let prenom = this.addForm.value.prenom.substring(0, 1)
    let nom = this.addForm.value.nom.substring(0, 1)
    let code_pays = this.addForm.value.nationalite.substring(0, 3)
    environment.dicNationaliteCode.forEach(code => {
      if (code[this.addForm.value.nationalite] && code[this.addForm.value.nationalite] != undefined) {
        code_pays = code[this.addForm.value.nationalite]
      }
    })
    let dn = new Date(this.addForm.value.date_naissance)
    let jour = dn.getDate()
    let mois = dn.getMonth() + 1
    let year = dn.getFullYear().toString().substring(2)
    let nb = (this.prospects.length + 1).toString()
    nb = nb.substring(nb.length - 3)
    return (code_pays + prenom + nom + jour + mois + year + nb).toUpperCase()
  }


  constructor(private LCS: LeadcrmService, private ToastService: MessageService, private route: ActivatedRoute, private router: Router) { }

    isUpdate = false
    paramID = ""
  ngOnInit(): void {
      this.route.params.subscribe(params => {
          const id = params['id']; // Récupérez l'ID à partir de l'URL
          this.paramID = id
          if (id) {
              // Si un ID est fourni, chargez les données du lead pour la mise à jour
              this.loadLeadData(id);
                this.isUpdate = true
          }
      });

  }



    private loadLeadData(id: string) {
        this.LCS.getOneByID(id).subscribe(data => {
            this.addForm.patchValue({...data})
        })
    }


    onUpdate() {
        this.LCS.update({...this.addForm.value}).subscribe(data => {
            this.ToastService.add({severity: "success", summary: "Mise à jour du lead"})
        })
        this.router.navigate(['/crm/leads/liste']);
    }

}
