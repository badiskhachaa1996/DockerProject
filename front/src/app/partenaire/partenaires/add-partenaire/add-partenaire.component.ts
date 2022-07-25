import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Partenaire } from 'src/app/models/Partenaire';
import { PartenaireService } from 'src/app/services/partenaire.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-add-partenaire',
  templateUrl: './add-partenaire.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./add-partenaire.component.scss']
})
export class AddPartenaireComponent implements OnInit {

  registerForm: FormGroup;
  display: boolean;

  typeSoc = [
    { value: "Choissiez le type de la société", actif:true},
    { value: "Professionel (Société)", actif:false},
    { value: "Particulier (Personne)", actif:false},
  ];

  formatJuridique = [
    { value: "Choissiez le type de la société", actif:true},
    { value: "EIRL", actif:false },
    { value: "EURL", actif:false },
    { value: "SARL", actif:false },
    { value: "SA", actif:false },
    { value: "SAS", actif:false },
    { value: "SNC", actif:false },
    { value: "Etudiant IMS", actif:false },
    { value: "Individuel", actif:false }
  ];


  token;

  pL:Partenaire[];

  dropdownItems = [
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
  ];

  constructor(private messageService: MessageService, private formBuilder: FormBuilder, private partenaireService: PartenaireService, private router: Router) { }

  ngOnInit(): void {
    this.partenaireService.getAll().subscribe(data => {
      this.pL = data
    })
    this.onInitRegisterForm();
  }


  //Formulaire d'ajout d'un partenaire
  onInitRegisterForm() {
    this.registerForm = this.formBuilder.group({
      nomSoc: ['', Validators.required],
      phonePartenaire: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      emailPartenaire: ['', [Validators.required, Validators.email]],
      number_TVA: ['', []],
      SIREN: ['', [Validators.pattern('[- +()0-9]+')]],
      SIRET: ['', [Validators.pattern('[- +()0-9]+')]],
      format_juridique: [this.formatJuridique[0]],
      indicatif: ['', Validators.required],
      type: [this.typeSoc[0]],
      APE: ['', []],
      Services: ['', [Validators.required]],
      Pays: ['', [Validators.required]],
      //WhatsApp: ['', [Validators.pattern('[- +()0-9]+')]],
    });
  }

  //Traitement de la saisie des données du formulaire 
  get nomSoc() { return this.registerForm.get('nomSoc'); }
  get phonePartenaire() { return this.registerForm.get('phonePartenaire'); }
  get emailPartenaire() { return this.registerForm.get('emailPartenaire'); }

  get number_TVA() { return this.registerForm.get('number_TVA'); }
  get SIREN() { return this.registerForm.get('SIREN'); }
  get SIRET() { return this.registerForm.get('SIRET'); }
  get format_juridique() { return this.registerForm.get('format_juridique').value; }
  get type() { return this.registerForm.get('type').value; }
  get APE() { return this.registerForm.get('APE'); }
  get Services() { return this.registerForm.get('Services'); }
  get Pays() { return this.registerForm.get('Pays'); }
  get WhatsApp() { return this.registerForm.get('WhatsApp'); }


  saveUser() {
    if (this.registerForm.value.type.value == "Professionel (Société)" && (this.registerForm.value.number_TVA == null || this.registerForm.value.SIREN == null || this.registerForm.value.SIRET == null || this.registerForm.value.APE == null)) {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erreur', detail: 'Tous les champs ne sont pas remplis' });
    } else {
      let p = new Partenaire(
        null,
        null,
        this.generateCode(),
        this.registerForm.value.nomSoc,
        this.registerForm.value.indicatif + this.registerForm.value.phonePartenaire,
        this.registerForm.value.emailPartenaire,
        this.registerForm.value.number_TVA,
        this.registerForm.value.SIREN,
        this.registerForm.value.SIRET,
        this.registerForm.value.format_juridique.value,
        this.registerForm.value.type.value,
        this.registerForm.value.APE,
        this.registerForm.value.Services,
        this.registerForm.value.Pays,
        // this.registerForm.value.WhatsApp

      )

      //TODO Create etudiant/Alternant
      this.partenaireService.create(p).subscribe(data => {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success', detail: 'Partenaire ajouté' });
        //vider le formulaire
        this.registerForm.reset();
      }, error => {
        console.error(error)
      });
    }

  }

  generateCode() {
    /*let random = Math.random().toString(36).substring(0, 3).toUpperCase();

    let prenom = firstname.replace(/[^a-z0-9]/gi, '').substr(0, 1).toUpperCase();

    return prenom + random;*/
    let n = (this.pL.length + 1).toString().substring(0, 3)
    while (n.length < 3) {
      n = "0" + n
    }
    let pays = this.registerForm.value.Pays.toUpperCase().substring(0, 3)
    return "EHP" + pays + n
  };

}
