import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService as ToastService } from 'primeng/api';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { CampusService } from 'src/app/services/campus.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { AuthService } from 'src/app/services/auth.service';
import { Partenaire } from 'src/app/models/Partenaire';
import jwt_decode from "jwt-decode";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-partenaire',
  templateUrl: './list-partenaire.component.html',
  styleUrls: ['./list-partenaire.component.scss'],
  providers: [MessageService, ConfirmationService],
  styles: [`
        :host ::ng-deep  .p-frozen-column {
            font-weight: bold;
        }

        :host ::ng-deep .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        :host ::ng-deep .p-progressbar {
            height:.5rem;
        }
    `]
})
export class ListPartenaireComponent implements OnInit {

  partenaires = []
  users = {}
  token;
  showFormAddPartenaire = false
  statutList = environment.typeUser
  civiliteList = environment.civilite;
  entreprisesList = []
  campusList = []
  formationList = []
  typeSoc = [{ value: "Professionel (Société)" }, { value: "Particulier (Personne)" }]
  formatJuridique = [{ value: "EIRL" }, { value: "EURL" }, { value: "SARL" }, { value: "SA" }, { value: "SAS" }, { value: "SNC" }, { value: "Etudiant IMS" }, { value: "Individuel" }]
  genderMap: any = { 'Monsieur': 'Mr.', 'Madame': 'Mme.', undefined: '', 'other': 'Mel.' };

  registerForm: FormGroup;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild('dt') table: Table;

  constructor(private formBuilder: FormBuilder, private messageService: ToastService, private entrepriseService: EntrepriseService, private formationService: DiplomeService, private campusService: CampusService, private partenaireService: PartenaireService, private route: ActivatedRoute, private router: Router, private UserService: AuthService) { }

  ngOnInit(): void {

    this.updateList();
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

  updateList() {
    this.partenaireService.getAll().subscribe(data => {
      this.partenaires = data
    })
    this.UserService.getAll().subscribe(dataU => {
      dataU.forEach(u => {
        this.users[u._id] = u
      })
    })
  }

  seePreRecruted(rowData: Partenaire) {
    this.router.navigate(["/gestion-preinscriptions/" + rowData._id])
  }

  seeRecruted(rowData: Partenaire) {
    this.router.navigate(["/etudiants/" + rowData._id])
  }

  seeUnderPartenaire(rowData) {
    this.router.navigate(["/collaborateur/" + rowData._id])
  }


  //Permet de vider les filtres
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

}

